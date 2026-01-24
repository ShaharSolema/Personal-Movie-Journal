import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./style.css";
import App from "./App.jsx";


// Mount the React app.
const root = createRoot(document.getElementById("root"));
root.render(<App />);