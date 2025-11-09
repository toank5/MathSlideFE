import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { schoolApi } from '../school/schoolApi';
import type { SchoolDropdown } from '../school/school';
interface SharedState {
  schoolList: SchoolDropdown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SharedState = {
  schoolList: [],
  isLoading: false,
  error: null,
};

export const fetchSchoolNames = createAsyncThunk(
  'shared/fetchSchoolNames',
  async (_, { rejectWithValue }) => {
    try {
      const schoolList = await schoolApi.getSchoolNames();
      return schoolList;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch school names');
    }
  }
);

const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolNames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchoolNames.fulfilled, (state, action: PayloadAction<SchoolDropdown[]>) => {
        state.isLoading = false;
        state.schoolList = action.payload;
      })
      .addCase(fetchSchoolNames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default sharedSlice.reducer;