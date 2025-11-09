// src/features/auth/auth.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import type { LoginRequest, RegisterDto, User } from "./user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  userProfile: User | null; 
  profileLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  registrationSuccess: false,
  userProfile: null,
  profileLoading: false,
};

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profileData = await authApi.getProfile();
      return profileData;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch profile');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (registerDto: RegisterDto, { rejectWithValue }) => {
    try {
      const response = await authApi.register(registerDto);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to register');
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (loginRequest: LoginRequest, { rejectWithValue }) => {
    try {
      await authApi.login(loginRequest);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to login";
      return rejectWithValue(errorMessage);
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
  reducers: {
    resetRegistrationStatus: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },
  },
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
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const { resetRegistrationStatus } = authSlice.actions;

export default authSlice.reducer;
