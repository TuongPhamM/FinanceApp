import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QuickstartProvider } from "./Context";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QuickstartProvider>
      <App />
    </QuickstartProvider>
  </React.StrictMode>
);

reportWebVitals();
