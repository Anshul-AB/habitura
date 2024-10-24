import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router-dom";
import { register as registerServiceWorker } from './serviceWorkerRegistration';

// Ensure that the environment variables are defined
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={clientId}
      redirectUri={redirectUri}
    >
      <Router>
        <App />
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register the service worker
registerServiceWorker();