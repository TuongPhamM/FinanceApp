import { createContext, useReducer } from "react";

const initialState = {
  linkSuccess: false,
  isItemAccess: true,
  isPaymentInitiation: false,
  linkToken: "",
  accessToken: null,
  itemId: null,
  isError: false,
  backend: true,
  products: ["balance", "transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
  filters: { year: "", month: "" },
  transactions: [],
  chartData: [],
  monthlyTotals: [],
};

const Context = createContext(initialState);

export const QuickstartProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      case "SET_CHART_DATA":
        return { ...state, chartData: action.chartData };
      case "SET_TRANSACTIONS":
        return { ...state, transactions: action.transactions };
      case "SET_FILTERS":
        return { ...state, filters: action.filters };
      case "SET_MONTHLY_TOTALS":
        return { ...state, monthlyTotals: action.monthlyTotals };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
