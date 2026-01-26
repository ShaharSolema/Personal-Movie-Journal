import { create } from "zustand";
import apiClient from "../lib/apiClient";

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    message: null,
    fetchingUser: false,

    // Register a new user and store the user profile on success.
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

    // Log in and cache the user profile in state.
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

    // Attempt to load the currently authenticated user (session restore).
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

    // Invalidate the session cookie on the server and clear local state.
    logout: async () => {
        try {
            await apiClient.post(`/users/logout`);
        } catch (error) {
            // Ignore logout errors to ensure UI clears state.
        }
        set({ user: null });
    }

}));
