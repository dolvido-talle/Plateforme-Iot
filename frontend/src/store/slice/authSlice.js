import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Peut être utilisé pour stocker des infos utilisateur
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user; // stocke des infos sur l'utilisateur
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload; // Mettre à jour simplement isAuthenticated
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setAuthenticated, logoutUser } = authSlice.actions;
export default authSlice.reducer;
