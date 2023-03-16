import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
const API_URL = process.env.REACT_APP_API_URL || "";

const root = ReactDOM.createRoot(document.getElementById("root"));
//DEFINE THE CLIENT
const client = new ApolloClient({
  cache: new InMemoryCache(), //Cache the fetched data in memory
  uri: API_URL,
});
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

reportWebVitals();
