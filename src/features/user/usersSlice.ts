import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { userApi, UserStatus } from './userApi';
import type { PagedResult } from '../school/school';
import type { User } from '../auth/user';

interface UsersState {
  pagedUsers: PagedResult<User>;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  pagedUsers: { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 },
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ pageIndex, pageSize, search, status }: {
    pageIndex: number;
    pageSize: number;
    search?: string;
    status?: UserStatus | '';
  }) => {
    const response = await userApi.getUsers({ pageIndex, pageSize, search, status });
    return response;
});

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ userId, status, currentFilters }: {
    userId: string;
    status: UserStatus;
    currentFilters: any;
  }, { dispatch }) => {
    await userApi.updateUserStatus(userId, status);
    dispatch(fetchUsers(currentFilters));
    return { userId, status };
});


const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.isLoading = true; })
    .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PagedResult<User>>) => {
      state.isLoading = false;
      state.pagedUsers = action.payload;
    })
    .addCase(fetchUsers.rejected, (state) => { state.isLoading = false; })
    
    .addCase(updateUserStatus.pending, (state) => { state.isLoading = true; })
    .addCase(updateUserStatus.fulfilled, (state) => {
      state.isLoading = false;
    })
    .addCase(updateUserStatus.rejected, (state) => { state.isLoading = false; });
  },
});


export default usersSlice.reducer;