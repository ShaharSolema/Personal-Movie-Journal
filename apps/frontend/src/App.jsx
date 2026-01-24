import { MantineProvider } from "@mantine/core";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
    return (
        <MantineProvider
            theme={{
                fontFamily: "Trebuchet MS, 'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
                primaryColor: "blue",
                defaultRadius: "md"
            }}
        >
            {/* App-level providers */}
            <Navbar/>
            <Home/>
        </MantineProvider>
    );
}

export default App;