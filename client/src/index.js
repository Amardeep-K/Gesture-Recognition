import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from "./App";
import { VideoCallProvider } from "./context/Context";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "./index.css";


const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root element
root.render(
  <React.StrictMode>
    <VideoCallProvider>
      <App />
    </VideoCallProvider>
  </React.StrictMode>
);
