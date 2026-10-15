import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },

        setAuthLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
    },
});

export const {
    setUser,
    setAccessToken,
    setAuthLoading,
    clearAuth,
    logout
} = authSlice.actions;

export default authSlice.reducer;