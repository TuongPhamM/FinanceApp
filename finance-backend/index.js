'use strict';

require('dotenv').config();
const {
  Configuration,
  PlaidApi,
  Products,
  PlaidEnvironments,
} = require('plaid');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const ItemModel = require('./models/Items');
const AccountModel = require('./models/Accounts'); // Adjust the path as necessary
const TransactionModel = require('./models/Transactions');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const APP_PORT = process.env.APP_PORT || 8000;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (
  process.env.PLAID_PRODUCTS || Products.Transactions
).split(',');

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// Parameter used for OAuth in Android. This should be the package name of your app,
// e.g. com.plaid.linksample
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
let ACCOUNT_ID = null;
let CURSOR = null;
// The payment_id is only relevant for the UK/EU Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store along with the Payment metadata, such as userId .
let PAYMENT_ID = null;
// The transfer_id and authorization_id are only relevant for Transfer ACH product.
// We store the transfer_id in memory - in production, store it in a secure
// persistent data store
let AUTHORIZATION_ID = null;
let TRANSFER_ID = null;

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
app.use(cors());

app.post('/api/info', function (request, response, next) {
  response.json({
    client_id: PLAID_CLIENT_ID,
    secret_id: PLAID_SECRET,
    environment: PLAID_ENV,
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products: PLAID_PRODUCTS,
  });
});

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
// valid for 4 hours
app.post('/api/create_link_token', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
      const configs = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: 'user-id',
        },
        client_name: 'Plaid Quickstart',
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: 'en',
      };

      if (PLAID_REDIRECT_URI !== '') {
        configs.redirect_uri = PLAID_REDIRECT_URI;
      }

      if (PLAID_ANDROID_PACKAGE_NAME !== '') {
        configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
      }
      console.log(configuration.baseOptions);
      const createTokenResponse = await client.linkTokenCreate(configs); //response object
      prettyPrintResponse(createTokenResponse);
      response.json(createTokenResponse.data);
    })
    .catch(next);
});

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
app.post('/api/set_access_token', function (request, response, next) {
  const publicToken = request.body.public_token;
  Promise.resolve()
    .then(async function () {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: publicToken, //request body
      });
      console.log(tokenResponse);
      const accessToken = tokenResponse.data.access_token;
      const itemId = tokenResponse.data.item_id;

      // Check if the item already exists in the database
      const existingItem = await ItemModel.findOne({ plaid_item_id: itemId });
      if (existingItem) {
        // Update the existing item's access token
        existingItem.access_token = accessToken;
        await existingItem.save();
      } else {
        // Or create a new item record
        const newItem = new ItemModel({
          plaid_item_id: itemId,
          access_token: accessToken,
          cursor: null,
        });
        await newItem.save();
      }

      response.json({
        //return a json body of access and item id to front-end
        // maybe we can assign this token into the user information
        // the 'access_token' is a private token, DO NOT pass this token to the frontend in your production environment
        access_token: accessToken,
        item_id: itemId,
        error: null,
      });
    })
    .catch(next);
});

// Retrieve real-time Balances for each of an Item's accounts
// https://plaid.com/docs/#balance
app.post('/api/balance', function (request, response, next) {
  const accessToken = request.body.access_token;
  Promise.resolve()
    .then(async function () {
      const balanceResponse = await client.accountsBalanceGet({
        //return 8 latest transaction without a cursor
        access_token: accessToken,
      });
      const accounts = balanceResponse.data.accounts;
      const itemId = balanceResponse.data.item.item_id;

      // Iterate over accounts and save/update each in MongoDB
      accounts.forEach(async (account) => {
        const {
          account_id,
          balances,
          mask,
          name,
          official_name,
          subtype,
          type,
        } = account;

        // Check if the account already exists in the database, existingAccount is boolean which is either true or false
        const existingAccount = await AccountModel.findOne({
          plaid_account_id: account_id,
        });

        if (existingAccount) {
          // Update the existing account's information
          existingAccount.set({
            available_balance: balances.available,
            current_balance: balances.current,
            limit: balances.limit,
            mask: mask,
            account_name: name,
            official_name: official_name,
            account_type: type,
            account_subtype: subtype,
          });
          await existingAccount.save();
        } else {
          // Or create a new account record
          const newAccount = new AccountModel({
            item_id: itemId,
            plaid_account_id: account_id,
            institution_name: '', // You may need to fetch or store this information elsewhere
            account_name: name,
            account_type: type,
            account_subtype: subtype,
            available_balance: balances.available,
            current_balance: balances.current,
            iso_currency_code: balances.iso_currency_code,
            limit: balances.limit,
            mask: mask,
            official_name: official_name,
          });
          await newAccount.save();
        }
      });

      response.json(balanceResponse.data);
    })
    .catch(next);
});

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
app.post('/api/transactions', async (request, response, next) => {
  const accessToken = request.body.access_token;

  try {
    const existingItem = await ItemModel.findOne({
      access_token: accessToken,
    });

    if (!existingItem) {
      return response.status(404).json({ error: 'Item not found.' });
    }

    const transactionsResponse = await client.transactionsSync({
      access_token: accessToken,
      cursor: existingItem.cursor || '',
    });

    const {
      added,
      modified,
      removed,
      next_cursor: nextCursor,
    } = transactionsResponse.data;

    // Handle Added Transactions
    for (const transaction of added) {
      const newTransaction = new TransactionModel({
        plaid_transaction_id: transaction.transaction_id,
        plaid_account_id: transaction.account_id,
        iso_currency_code: transaction.iso_currency_code,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        merchant_name: transaction.merchant_name,
        pending: transaction.pending,
      });
      await newTransaction.save();
    }

    // Handle Modified Transactions
    for (const transaction of modified) {
      await TransactionModel.findOneAndUpdate(
        { plaid_transaction_id: transaction.transaction_id },
        {
          $set: {
            amount: transaction.amount,
            pending: transaction.pending,
          },
        },
      );
    }

    // Handle Removed Transactions
    for (const transaction of removed) {
      await TransactionModel.deleteOne({
        plaid_transaction_id: transaction.transaction_id,
      });
    }

    // Update the cursor in the existing item for the next sync
    existingItem.cursor = nextCursor;
    await existingItem.save();

    // Optionally, sort and limit the output if needed
    const recentlyAdded = added.slice(0, 8); // Simplified for brevity

    response.json({ latest_transactions: recentlyAdded });
  } catch (error) {
    next(error);
  }
});

app.post('/api/transactions/filter', async (request, response) => {
  const { access_token, month, year } = request.body;

  try {
    // First, find the item associated with the access_token
    const item = await ItemModel.findOne({ access_token });
    if (!item) {
      return response.status(404).json({ error: 'Item not found.' });
    }

    // Then, find all accounts associated with this item
    const accounts = await AccountModel.find({ item_id: item.plaid_item_id });
    const accountIds = accounts.map((account) => account.plaid_account_id);

    // Finally, fetch transactions for these accounts that match the month and year
    const startDate = new Date(`${year}-${month}-01`); // Months are 0-indexed
    const endDate = new Date(`${year}-${month}-01`); // Last moment of the month
    endDate.setMonth(endDate.getMonth() + 1);

    const transactions = await TransactionModel.find({
      plaid_account_id: { $in: accountIds },
      date: { $gte: startDate, $lt: endDate },
    });

    response.json(transactions);
  } catch (error) {
    console.error('Error fetching filtered transactions:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

app.use('/api', function (error, request, response, next) {
  prettyPrintResponse(error.response);
  response.json(formatError(error.response));
});

const getBalances = async function (accessToken) {
  const getBalancesResponse = await client.getBalancesResponse({
    access_token: accessToken,
  });
  const balances = getBalancesResponse.data.account[0].balances;
  return balances;
};

const server = app.listen(APP_PORT, function () {
  console.log('plaid-quickstart server listening on port ' + APP_PORT);
});

const prettyPrintResponse = (response) => {
  if (!response || !response.data) {
    console.error('Response or response.data is undefined');
    return;
  } else {
    console.log(util.inspect(response.data, { colors: true, depth: 4 }));
  }
};

const formatError = (error) => {
  return {
    error: { ...error.data, status_code: error.status },
  };
};
