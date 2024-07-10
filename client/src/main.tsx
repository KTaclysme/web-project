import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
        <ToastContainer />
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);
