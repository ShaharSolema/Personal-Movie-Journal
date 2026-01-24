import {Route,Routes} from 'react-router';
import { MantineProvider } from "@mantine/core";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Moviepage from './pages/Moviepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

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
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/movie/:id" element={<Moviepage />}/>
                <Route path="/signin" element={<SignIn />}/>
                <Route path="/signup" element={<SignUp />}/>
            </Routes>
        </MantineProvider>
    );
}

export default App;