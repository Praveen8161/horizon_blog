import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ContextAPI from "./Context/ContextAPI.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextAPI>
        <App />
      </ContextAPI>
    </BrowserRouter>
  </React.StrictMode>
);
