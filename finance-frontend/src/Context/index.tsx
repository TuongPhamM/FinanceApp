import { createContext, useReducer, Dispatch, ReactNode } from "react";

interface QuickstartState {
  linkSuccess: boolean;
  isItemAccess: boolean;
  isPaymentInitiation: boolean;
  linkToken: string | null;
  accessToken: string | null;
  itemId: string | null;
  isError: boolean;
  backend: boolean;
  products: string[];
  linkTokenError: {
    error_message: string;
    error_code: string;
    error_type: string;
  };
  filters: {
    year: string;
    month: string;
  };
  transactions: any[];
  chartData: any[];
}

const initialState: QuickstartState = {
  linkSuccess: false,
  isItemAccess: true,
  isPaymentInitiation: false,
  linkToken: "", // Don't set to null or error message will show up briefly when site loads
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
};

type QuickstartAction =
  | {
      type: "SET_STATE";
      state: Partial<QuickstartState>;
    }
  | {
      type: "SET_CHART_DATA";
      chartData: any[];
    }
  | {
      type: "SET_TRANSACTIONS";
      transactions: any[];
    }
  | {
      type: "SET_FILTERS";
      filters: {
        year: string;
        month: string;
      };
    };

interface QuickstartContext extends QuickstartState {
  dispatch: Dispatch<QuickstartAction>;
}

const Context = createContext<QuickstartContext>(
  initialState as QuickstartContext
);

const { Provider } = Context;
export const QuickstartProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const reducer = (
    state: QuickstartState,
    action: QuickstartAction
  ): QuickstartState => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      case "SET_CHART_DATA":
        return { ...state, chartData: action.chartData };
      case "SET_TRANSACTIONS":
        return { ...state, transactions: action.transactions };
      case "SET_FILTERS":
        return { ...state, filters: action.filters };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ ...state, dispatch }}>{props.children}</Provider>;
};

export default Context;
