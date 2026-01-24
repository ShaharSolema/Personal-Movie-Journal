import React from "react";
import Logo from "./Logo.jsx";
import {Search } from "lucide-react";
const Navbar = () => {
    return (
        <nav className="bg-black text-red-200 flex justify-between items-center p-4 h-20
        text-sm md:text-[15px] font-medium text-nowrap">
            <Logo />

            <ul className="hidden xl:flex space-x-6">
                <li className="cursor-pointer hover:text-[#e50914]">Home</li>
                <li className="cursor-pointer hover:text-[#e50914]">Tv Shows</li>
                <li className="cursor-pointer hover:text-[#e50914]">Movies</li>
                <li className="cursor-pointer hover:text-[#e50914]">Games</li>
                <li className="cursor-pointer hover:text-[#e50914]">New & Popular</li>
                <li className="cursor-pointer hover:text-[#e50914]">Upcoming</li>
               
            </ul>
            <div className="flex items-center space-x-4 relative">
                <div className="relative hidden md:inline-flex">
                    <input type="text" className="bg-[#333333] px-4 py-2 rounded-full min-w-72 pr-10 outline-none " placeholder="Search..." />
                    <Search className="absolute top-2 right-4 w-5 h-5"/>
                </div>
                
                <button className="bg-[#e50914] px-5 py-2 text-white cursor-pointer rounded-full hover:bg-[#b20710]">Get AI Movie Picks</button>
                <button className="border border-[#333333] py-2 px-4 cursor-pointer hover:bg-[#e50914] rounded-full">Sign In</button>
            </div>
        </nav>
    );
}


export default Navbar;