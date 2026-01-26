import { create } from "zustand";
import apiClient from "../lib/apiClient";

export const useJournalStore = create((set) => ({
    entries: [],
    entriesByTmdb: {},
    isLoading: false,
    error: null,

    // Cache a single entry by TMDB id for quick lookup in buttons.
    setEntryByTmdb: (entry) =>
        set((state) => {
            if (!entry?.tmdbId) {
                return state;
            }
            return {
                entriesByTmdb: {
                    ...state.entriesByTmdb,
                    [entry.tmdbId]: entry
                }
            };
        }),

    // Remove a cached entry by TMDB id.
    removeEntryByTmdb: (tmdbId) =>
        set((state) => {
            if (!tmdbId) {
                return state;
            }
            const next = { ...state.entriesByTmdb };
            delete next[tmdbId];
            return { entriesByTmdb: next };
        }),

    // Update an entry locally for instant UI feedback (optimistic update).
    setEntryLocal: (id, updates) =>
        set((state) => {
            const entries = state.entries.map((entry) =>
                entry._id === id ? { ...entry, ...updates } : entry
            );
            const entriesByTmdb = entries.reduce((acc, entry) => {
                if (entry?.tmdbId) {
                    acc[entry.tmdbId] = entry;
                }
                return acc;
            }, {});
            return { entries, entriesByTmdb };
        }),

    // Remove an entry locally (used when moving between tabs).
    removeEntryLocal: (id) =>
        set((state) => {
            const entries = state.entries.filter((entry) => entry._id !== id);
            const entriesByTmdb = entries.reduce((acc, entry) => {
                if (entry?.tmdbId) {
                    acc[entry.tmdbId] = entry;
                }
                return acc;
            }, {});
            return { entries, entriesByTmdb };
        }),

    // Fetch all journal entries for the current user.
    fetchEntries: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/journal`, { params });
            const entriesByTmdb = response.data.reduce((acc, entry) => {
                if (entry?.tmdbId) {
                    acc[entry.tmdbId] = entry;
                }
                return acc;
            }, {});
            set({ entries: response.data, entriesByTmdb, isLoading: false });
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
            set((state) => ({
                entriesByTmdb: {
                    ...state.entriesByTmdb,
                    [tmdbId]: response.data
                }
            }));
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
                entriesByTmdb: {
                    ...state.entriesByTmdb,
                    [response.data?.tmdbId]: response.data
                },
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
                entriesByTmdb: {
                    ...state.entriesByTmdb,
                    [response.data?.tmdbId]: response.data
                },
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
                entriesByTmdb: state.entries.reduce((acc, entry) => {
                    if (entry._id !== id && entry?.tmdbId) {
                        acc[entry.tmdbId] = entry;
                    }
                    return acc;
                }, {}),
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
