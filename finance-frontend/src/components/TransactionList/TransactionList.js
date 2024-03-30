import React, { useContext } from "react";
import "./TransactionListStyle.css";
import Context from "../../Context";

function TransactionList() {
  const { transactions } = useContext(Context);
  return (
    <div>
      <h2>Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>{" "}
            {/* Consider removing or modifying this if not used */}
            <th>Date</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Note</th>{" "}
            {/* Consider removing or modifying this if not used */}
            <th>Verified</th>{" "}
            {/* Pending status? Adjust according to your data */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.plaid_account_id || "N/A"}</td>{" "}
              {/* Modify according to your data */}
              <td>{transaction.date}</td>
              <td>{transaction.name}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.category.join(", ")}</td>{" "}
              {/* Assuming category is an array */}
              <td>{transaction.note || "N/A"}</td>{" "}
              {/* Modify according to your data */}
              <td>{transaction.pending ? "Pending" : "Completed"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
