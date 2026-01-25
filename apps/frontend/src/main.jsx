import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./style.css";
import App from "./App.jsx";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";


// Mount the React app.
const root = createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </StrictMode>
);
