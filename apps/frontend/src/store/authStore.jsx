import { create } from "zustand";
import apiClient from "../lib/apiClient";

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    message: null,
    fetchingUser: false,


    signup: async (username, email, password) => {
        set({ isLoading: true, message: null });

        try {
            const response = await apiClient.post(`/users/register`, {
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
            const response= await apiClient.post(`/users/login`,{
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
    },

    fetchCurrentUser: async () => {
        set({ fetchingUser: true, error: null });
        try {
            const response = await apiClient.get(`/users/me`);
            set({ user: response.data.user, fetchingUser: false });
            return response.data.user;
        } catch (error) {
            set({ user: null, fetchingUser: false });
            return null;
        }
    },

    logout: async () => {
        try {
            await apiClient.post(`/users/logout`);
        } catch (error) {
            // Ignore logout errors to ensure UI clears state.
        }
        set({ user: null });
    }

}));
