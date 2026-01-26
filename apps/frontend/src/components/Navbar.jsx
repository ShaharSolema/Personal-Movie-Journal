import React, { useEffect, useState } from "react";
import Logo from "./Logo.jsx";
import { Search } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Top navigation bar with search and session actions.
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState("");
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        // Keep the navbar search box synced with the Search page query.
        if (location.pathname === "/search") {
            const currentQuery = searchParams.get("q") || "";
            setQuery(currentQuery);
        } else {
            // Clear the input when leaving the Search page.
            setQuery("");
        }
    }, [location.pathname, searchParams]);

    const handleSearch = (event) => {
        // Keep search simple: push the query into the URL.
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) {
            return;
        }
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    return (
        <nav className="bg-black text-red-200 flex justify-between items-center p-4 h-20
        text-sm md:text-[15px] font-medium text-nowrap">
            <Logo />

            <ul className="hidden xl:flex space-x-6">
                <li className="cursor-pointer hover:text-[#e50914]">
                    <Link to="/">Home</Link>
                </li>
                <li className="cursor-pointer hover:text-[#e50914]">
                    <Link to="/search">Search</Link>
                </li>
                <li className="cursor-pointer hover:text-[#e50914]">
                    <Link to="/ai-picks">AI Picks</Link>
                </li>
                <li className="cursor-pointer hover:text-[#e50914]">
                    <Link to="/my-space">My Space</Link>
                </li>
            </ul>
            <div className="flex items-center space-x-4 relative">
                <form onSubmit={handleSearch} className="relative hidden md:inline-flex">
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="bg-[#333333] px-4 py-2 rounded-full min-w-72 pr-10 outline-none"
                        placeholder="Search movies..."
                    />
                    <button
                        type="submit"
                        className="absolute top-2 right-4 text-red-200 hover:text-[#e50914]"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </form>

                <Link to="/ai-picks">
                    <button className="bg-[#e50914] px-5 py-2 text-white cursor-pointer rounded-full hover:bg-[#b20710]">
                        Get AI Movie Picks
                    </button>
                </Link>
                {user ? (
                    <button
                        onClick={logout}
                        className="border border-[#333333] py-2 px-4 cursor-pointer hover:bg-[#e50914] rounded-full"
                    >
                        Sign Out
                    </button>
                ) : (
                    <Link to={"/signin"}>
                        <button className="border border-[#333333] py-2 px-4 cursor-pointer hover:bg-[#e50914] rounded-full">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}


export default Navbar;
