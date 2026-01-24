import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_BASE_URL = "http://localhost:3000/api/users";

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    message: null,
    fetchingUser: true,


    signup: async (username, email, password) => {
        set({ isLoading: true, message: null });

        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                username,
                email,
                password
            });
            set({ user: response.data.user, isLoading: false, error: null });
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || "Error signup" });
            throw error;
        }

    },

    login:async (username,password)=>{
        set({isLoading:true,message:null,error:null});
        try {
            const response= await axios.post(`${API_BASE_URL}/login`,{
                username,
                password
            });

            const {user,message}=response.data;
            set({
                user,
                message,
                isLoading:false
            });

            return {user,message};

            
        } catch (error) {
            set({isLoading:false,error:error.response?.data?.message||"error login"});
            throw error;
        }
    }

}));
