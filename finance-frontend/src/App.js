import React, { useEffect, useContext, useCallback } from "react";
import styles from "./App.module.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Switch,
} from "@mui/material";
import { Helmet } from "react-helmet";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TransactionList from "./components/TransactionList";
import PieChart from "./components/PieChart";
import YearBox from "./components/YearBox";
import MonthBox from "./components/MonthBox";
import BarChart from "./components/BarChart";
import Header from "./components/Headers";
import Context from "./Context";
import Products from "./components/ProductTypes/Products";
import Items from "./components/ProductTypes/Items";

function App() {
  const { linkSuccess, isItemAccess, isPaymentInitiation, dispatch } =
    useContext(Context);
  const years = ["2020", "2021", "2022", "2023"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getInfo = useCallback(async () => {
    const response = await fetch("/api/info", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return;
    }
    const data = await response.json();
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
      },
    });
  }, [dispatch]);

  const generateToken = useCallback(async () => {
    // Link tokens for 'payment_initiation' use a different creation flow in your backend.

    const response = await fetch("/api/create_link_token", {
      //using this api as POST request
      method: "POST",
    });
    if (!response.ok) {
      //if response is not valid
      dispatch({ type: "SET_STATE", state: { linkToken: null } }); //set linkToken to null
      return;
    }

    const data = await response.json(); // data is response in json format

    if (data && data.error == null) {
      // if data is defined and error is null
      dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } }); //set linkToken
      // Save the link_token to be used later if needed.
      localStorage.setItem("link_token", data.link_token);
    } else {
      dispatch({
        type: "SET_STATE",
        state: {
          linkToken: null,
          linkTokenError: data.error,
        },
      });
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      // Directly proceed to token generation as we're skipping payment initiation.
      // Check for OAuth redirect scenario and handle it accordingly.
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }
      await generateToken();
    };
    init();
  }, [dispatch, generateToken]);

  const chartData = {
    labels: [
      "Groceries",
      "Subscription",
      "Rent",
      "Gas",
      "Drone",
      "Personal Needs",
    ],
    datasets: [
      {
        label: "Spend",
        data: [200, 350, 1100, 300, 100, 300],
        backgroundColor: [
          "rgb(1, 220, 60)",
          "rgb(239, 221, 60)",
          "rgb(0, 102, 255)",
          "rgb(255, 162, 0)",
          "rgb(213, 0, 255)",
          "rgb(255, 0, 0)",
        ],
        borderColor: "#C0C0C0",
        borderWidth: 1,
      },
    ],
  };

  const transactions = [
    // Sample transaction data
    {
      user: "John Doe",
      date: "2023-08-17",
      name: "Groceries",
      amount: 200,
      category: "Food",
      note: "Weekly grocery shopping",
      verified: true,
    },
    // Add more transactions as needed
  ];

  // Declare age at the top-level scope of the App component
  const [year, setYear] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [checked, setChecked] = React.useState(true);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
      <Header />
      {linkSuccess && (
        <>
          {isPaymentInitiation && <Products />}
          {isItemAccess && (
            <>
              <Products />
              <Items />
            </>
          )}
        </>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Align items to the right
          alignItems: "center", // Vertically center items
          minWidth: 12,
        }}
      >
        <div>
          <YearBox year={year} onChange={handleYearChange} years={years} />
          <MonthBox year={month} onChange={handleMonthChange} months={months} />
        </div>
        <div>
          <Switch
            checked={checked}
            onChange={handleCheckChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </Box>
      <div className={styles.chartContainer}>
        <PieChart data={chartData} />
        <BarChart data={chartData} />
      </div>
      <TransactionList transactions={transactions} />
    </div>
  );
}

export default App;
