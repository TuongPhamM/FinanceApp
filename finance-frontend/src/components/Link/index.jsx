import React, { useEffect, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import Button from "plaid-threads/Button";

import Context from "../../Context";
import { Products } from "plaid";
import styles from "./index.module.scss";

const Link = () => {
  const { linkToken, isPaymentInitiation, monthlyTotals, dispatch } =
    useContext(Context);

  const onSuccess = React.useCallback(
    (public_token) => {
      const exchangePublicTokenForAccessToken = async () => {
        const response = await fetch("/api/set_access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `public_token=${public_token}`,
        });
        if (!response.ok) {
          dispatch({
            type: "SET_STATE",
            state: {
              itemId: `no item_id retrieved`,
              accessToken: `no access_token retrieved`,
              isItemAccess: false,
            },
          });
          return;
        }
        const data = await response.json();
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: data.item_id, //put item_id into context
            accessToken: data.access_token, //put access token into context
            isItemAccess: true,
          },
        });
        localStorage.setItem("access_token", data.access_token);

        // Right after setting access token, fetch balance and transactions
        await fetchBalanceAndTransactions(data.access_token);
      };

      // Function to fetch balance and transactions into MongoDB
      const fetchBalanceAndTransactions = async (accessToken) => {
        // Fetch balance will store item's accounts
        await fetch("/api/balance", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `access_token=${accessToken}`,
        });

        // Fetch transactions will store 100 recent transactions
        await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `access_token=${accessToken}`,
        });

        const response = await fetch("/api/transactions/recent", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `access_token=${accessToken}`,
        });

        if (!response.ok) {
          // Handle errors, e.g., show an error message
          console.error("Failed to fetch transactions for monthly totals");
          return;
        }

        const monthlyTotals = await response.json();
        console.log("Fetched transactions for monthly totals:", monthlyTotals);

        dispatch({
          type: "SET_MONTHLY_TOTALS",
          monthlyTotals: monthlyTotals,
        });
      };

      // 'payment_initiation' products do not require the public_token to be exchanged for an access_token.
      if (isPaymentInitiation) {
        dispatch({ type: "SET_STATE", state: { isItemAccess: false } });
      } else {
        exchangePublicTokenForAccessToken();
      }

      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/");
    },
    [dispatch]
  );

  let isOauth = false;
  const config = {
    token: linkToken, //embedded it
    onSuccess,
  };

  if (window.location.href.includes("?oauth_state_id=")) {
    // TODO: figure out how to delete this ts-ignore
    // @ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config); //usePlaidLink will use the config to return public token

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);

  return (
    <Button
      type="button"
      large
      onClick={() => open()}
      disabled={!ready}
      className={styles.whiteTextButton}
    >
      Launch
    </Button>
  );
};

Link.displayName = "Link";

export default Link;
