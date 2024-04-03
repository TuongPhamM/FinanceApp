import React, { useEffect, useContext, useCallback } from "react";
import styles from "./App.module.css";
import { Box, Switch } from "@mui/material";
import { Helmet } from "react-helmet";
import TransactionList from "./components/TransactionList/TransactionList";
import PieChart from "./components/PieChart/PieChart";
import FiltersComponent from "./components/Filters/Filters";
import BarChart from "./components/BarChart/BarChart"; // Javascript file
import Header from "./components/Headers";
import Context from "./Context";

function App() {
  const { linkSuccess, isItemAccess, isPaymentInitiation, dispatch } =
    useContext(Context);

  // State to control visibility of content after successful link
  const [showContent, setShowContent] = React.useState(false);

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
    // Directly proceed to token generation as we're skipping payment initiation.
    // Check for OAuth redirect scenario and handle it accordingly.
    if (window.location.href.includes("?oauth_state_id=")) {
      dispatch({
        type: "SET_STATE",
        state: {
          linkToken: localStorage.getItem("link_token"),
        },
      });
      setShowContent(true); // Show content after OAuth redirect
    } else {
      generateToken();
    }
  }, [dispatch, generateToken]);

  // Automatically show content when linkSuccess is true
  useEffect(() => {
    if (linkSuccess) {
      setShowContent(true);
    }
  }, [linkSuccess]);

  const [checked, setChecked] = React.useState(true);

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
      <Header />
      {showContent && (
        <>
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
          <div className={styles.TransactionListContainer}>
            <TransactionList />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
