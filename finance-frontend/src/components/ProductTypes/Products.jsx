import React, { useContext } from "react";

import Endpoint from "../Endpoint";
import Context from "../../Context";
import ProductTypesContainer from "./ProductTypesContainer";
import {
  transactionsCategories,
  balanceCategories,
  transformTransactionsData,
  transformBalanceData,
} from "../../dataUtilities";

const Products = () => {
  const { products } = useContext(Context);
  return (
    <ProductTypesContainer productType="Products">
      {products.includes("balance") && (
        <Endpoint
          endpoint="balance"
          name="Balance"
          categories={balanceCategories}
          schema="api/balance"
          description="Check balances in real time to prevent non-sufficient funds
        fees."
          transformData={transformBalanceData}
        />
      )}
      {products.includes("transactions") && (
        <Endpoint
          endpoint="transactions"
          name="Transactions"
          categories={transactionsCategories}
          schema="api/transactions"
          description="Retrieve transactions or incremental updates for credit and depository accounts."
          transformData={transformTransactionsData}
        />
      )}
    </ProductTypesContainer>
  );
};

Products.displayName = "Products";

export default Products;
