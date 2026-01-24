import { useState } from "react";
import bg from "../../png/background.png";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";



const SignIn = () => {
    const navigate = useNavigate();
    const[username,SetUsername]=useState("");
    const[password,SetPassword]=useState("");
    const {login,isLoading,error}=useAuthStore();

    const handleLogin= async (e)=>{
        e.preventDefault();
        try {
            await login(username,password)
            navigate("/")
            console.log("logged in");
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div
        className="min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})` }}
        >
        <div className="max-w-[450px] w-full bg-black bg-opacity-75 rounded px-8 py-14 mx-auto">
            <h1 className="text-3xl font-medium text-white mb-7">Sign In</h1>

            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                <input  value={username} onChange={(e)=>SetUsername(e.target.value)}type="text" placeholder="username" className="w-full h-[50px] bg-[#131313] text-white rounded px-5 text-base"/>
                <input type="password" value={password } onChange={(e)=>SetPassword(e.target.value)} placeholder="password" className="w-full h-[50px] bg-[#131313] text-white rounded px-5 text-base"/>
                {error && <p className="text-red-500">{error}</p>}
                <button disabled={isLoading} type="submit" className="w-full bg-[#e50914] text-white py-2 rounded text-base hover:opacity-90 cursor-pointer">
                    Submit
                </button>
            </form>
            <div className="mt-10 text-[#737373] text-sm">
                <p>New to Movie journal?
                <span
                    onClick={() => navigate("/signup")}
                    className="text-white font-medium cursor-pointer ml-2 hover:underline"
                >
                    Sign Up Now
                </span>
                </p>
            </div>
        </div>
        </div>

    )
}

export default SignIn

