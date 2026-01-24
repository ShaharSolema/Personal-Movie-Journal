import {Route,Routes} from 'react-router';
import { MantineProvider } from "@mantine/core";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Moviepage from './pages/Moviepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Toaster from 'react-hot-toast';
function App() {
    return (
       <div>
            <Toaster />
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/movie/:id" element={<Moviepage />}/>
                <Route path="/signin" element={<SignIn />}/>
                <Route path="/signup" element={<SignUp />}/>
            </Routes>
        </div>
    );
}

export default App;