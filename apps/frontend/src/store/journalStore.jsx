import { create } from "zustand";
import apiClient from "../lib/apiClient";

export const useJournalStore = create((set) => ({
    entries: [],
    isLoading: false,
    error: null,

    // Update an entry locally for instant UI feedback (optimistic update).
    setEntryLocal: (id, updates) =>
        set((state) => ({
            entries: state.entries.map((entry) =>
                entry._id === id ? { ...entry, ...updates } : entry
            )
        })),

    // Remove an entry locally (used when moving between tabs).
    removeEntryLocal: (id) =>
        set((state) => ({
            entries: state.entries.filter((entry) => entry._id !== id)
        })),

    // Fetch all journal entries for the current user.
    fetchEntries: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/journal`, { params });
            set({ entries: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to load entries."
            });
            throw error;
        }
    },

    // Fetch a single entry by TMDB id (used to check if a movie is already saved).
    fetchEntryByTmdb: async (tmdbId) => {
        if (!tmdbId) {
            return null;
        }
        try {
            const response = await apiClient.get(`/journal/tmdb/${tmdbId}`);
            return response.data;
        } catch (error) {
            return null;
        }
    },

    // Create a new entry in the user's journal.
    addEntry: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post(`/journal`, payload);
            set((state) => ({
                entries: [response.data, ...state.entries],
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to add entry."
            });
            throw error;
        }
    },

    // Update an existing entry (rating, status, comments, favorite).
    updateEntry: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.patch(`/journal/${id}`, updates);
            set((state) => ({
                entries: state.entries.map((entry) =>
                    entry._id === id ? response.data : entry
                ),
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to update entry."
            });
            throw error;
        }
    },

    // Remove an entry from the journal.
    deleteEntry: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/journal/${id}`);
            set((state) => ({
                entries: state.entries.filter((entry) => entry._id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to delete entry."
            });
            throw error;
        }
    }
}));
