import React, { useContext } from "react";

import Endpoint from "../Endpoint";
import Context from "../../Context";
import ProductTypesContainer from "./ProductTypesContainer";
import {
  transactionsCategories,
  authCategories,
  identityCategories,
  balanceCategories,
  investmentsCategories,
  investmentsTransactionsCategories,
  liabilitiesCategories,
  paymentCategories,
  assetsCategories,
  incomePaystubsCategories,
  transferCategories,
  transferAuthorizationCategories,
  transformAuthData,
  transformTransactionsData,
  transformBalanceData,
  transformInvestmentsData,
  transformInvestmentTransactionsData,
  transformLiabilitiesData,
  transformIdentityData,
  transformPaymentData,
  transformAssetsData,
  transformTransferData,
  transformTransferAuthorizationData,
  transformIncomePaystubsData,
} from "../../dataUtilities";

const Products = () => {
  const { products } = useContext(Context);
  return (
    <ProductTypesContainer productType="Products">
      {!products.includes("payment_initiation") && (
        <Endpoint
          endpoint="balance"
          name="Balance"
          categories={balanceCategories}
          schema="balance"
          description="Check balances in real time to prevent non-sufficient funds
        fees."
          transformData={transformBalanceData}
        />
      )}
    </ProductTypesContainer>
  );
};

Products.displayName = "Products";

export default Products;
