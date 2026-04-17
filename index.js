import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
