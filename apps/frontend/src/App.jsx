import { Navigate, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Moviepage from './pages/Moviepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Search from "./pages/Search";
import MySpace from "./pages/MySpace";
import AiPicks from "./pages/AiPicks";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import ScrollToTop from "./components/ScrollToTop";

function App() {
    const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

    useEffect(() => {
        // Restore session on page load or refresh.
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return (
        <MantineProvider
            theme={{
                fontFamily: "Trebuchet MS, 'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
                primaryColor: "blue",
                defaultRadius: "md"
            }}
        >
            {/* App-level providers */}
            <ScrollToTop />
            <Navbar/>
            <Routes>
                {/* Public screens */}
                <Route path="/" element={<Home />}/>
                <Route path="/search" element={<Search />}/>
                <Route path="/movie/:id" element={<Moviepage />}/>
                <Route path="/my-space" element={<MySpace />}/>
                <Route path="/myspace" element={<Navigate to="/my-space" replace />}/>
                <Route path="/ai-picks" element={<AiPicks />}/>
                <Route path="/signin" element={<SignIn />}/>
                <Route path="/signup" element={<SignUp />}/>
            </Routes>
        </MantineProvider>
    );
}

export default App;
