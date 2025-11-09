// src/features/auth/auth.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import type { LoginRequest, User } from "./user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (loginRequest: LoginRequest, { rejectWithValue }) => {
    try {
      await authApi.login(loginRequest);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to login");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.me();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to logout");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
