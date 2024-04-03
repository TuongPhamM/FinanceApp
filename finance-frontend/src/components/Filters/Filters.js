// Filters.js
import React, { useState, useContext } from "react";
import YearBox from "../YearBox/YearBox";
import MonthBox from "../MonthBox/MonthBox";
import Context from "../../Context";
import Button from "@mui/material/Button";
import TransactionList from "../TransactionList/TransactionList";
import styles from "./Filters.module.css";
import ld from "lodash";

const FiltersComponent = () => {
  const { accessToken, dispatch } = useContext(Context);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  //create transaction list placeholder and pass them into transactionList component

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const applyFilters = async () => {
    // Ensure accessToken is available
    if (!accessToken) {
      console.log("Access token is not available.");
      return;
    }
    await fetchDataAndAnalyze(selectedYear, selectedMonth, accessToken);
  };

  const fetchDataAndAnalyze = async (year, month, accessToken) => {
    const response = await fetch("/api/transactions/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ year, month, access_token: accessToken }),
    });

    if (!response.ok) {
      // Handle errors, e.g., show an error message
      console.error("Failed to fetch transactions");
      return;
    }

    const transactions = await response.json();
    console.log("Fetched transactions:", transactions);

    const aggregatedData = aggregateDataForCharts(transactions);
    console.log("Aggregated data for charts:", aggregatedData);

    // Dispatch fetched transactions to context
    dispatch({
      type: "SET_TRANSACTIONS",
      transactions: transactions,
    });

    // Dispatch aggregated data for charts to context
    dispatch({
      type: "SET_CHART_DATA",
      chartData: aggregatedData,
    });
  };

  const aggregateDataForCharts = (transactions) => {
    // Group transactions by category and sum up the amounts
    // Assuming you have a predefined set of colors for categories
    const categoryColors = {
      Groceries: "rgb(1, 220, 60)",
      Payment: "rgb(17, 255, 0)",
      Travel: "rgb(0, 218, 233)",
      "Food and Drink": "rgb(255, 162, 0)",
      Transfer: "rgb(255, 0, 0)",

      // Add more categories and their colors
    };

    const aggregatedData = ld(transactions)
      .groupBy("category[0]") // Assuming the main category is the first in the category array
      .map((transactions, category) => ({
        label: category,
        value: ld.sumBy(transactions, "amount"),
        color: categoryColors[category] || "#000000",
      }))
      .value();

    return aggregatedData;
  };

  return (
    <div>
      <div className={styles.filterContainer}>
        <YearBox year={selectedYear} onChange={handleYearChange} />
        <MonthBox month={selectedMonth} onChange={handleMonthChange} />
        <div className={styles.button}>
          <Button
            className={styles.customButton}
            variant="contained"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersComponent;
