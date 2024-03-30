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
import TransactionList from "./components/TransactionList/TransactionList";
import PieChart from "./components/PieChart/PieChart";
import FiltersComponent from "./components/Filters/Filters";
import BarChart from "./components/BarChart/BarChart"; // Javascript file
import Header from "./components/Headers";
import Context from "./Context";
import Products from "./components/ProductTypes/Products";
import Items from "./components/ProductTypes/Items";

function App() {
  const { linkSuccess, isItemAccess, isPaymentInitiation, dispatch } =
    useContext(Context);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Align items to the right
          alignItems: "center", // Vertically center items
          minWidth: 12,
        }}
      >
        <div>
          <FiltersComponent />
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
        <PieChart />
        <BarChart />
      </div>
      <div>
        <TransactionList />
      </div>
    </div>
  );
}

export default App;
