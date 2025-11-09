import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { schoolApi } from "./schoolApi";
import type { PagedResult, School, SchoolDto } from "./school";

interface SchoolsState {
  pagedSchools: PagedResult<School>;
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingSchool: School | null;
}

const initialState: SchoolsState = {
  pagedSchools: { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 },
  isLoading: false,
  error: null,
  isModalOpen: false,
  editingSchool: null,
};

interface FetchSchoolsPayload {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
}

export const fetchSchools = createAsyncThunk(
  "schools/fetchSchools",
  async (params: FetchSchoolsPayload, { rejectWithValue }) => {
    try {
      const response = await schoolApi.getPaged(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch schools");
    }
  }
);

interface MutatePayload {
  filters: FetchSchoolsPayload;
}
interface AddSchoolPayload extends MutatePayload {
  schoolDto: SchoolDto;
}
interface EditSchoolPayload extends MutatePayload {
  school: School;
}
interface RemoveSchoolPayload extends MutatePayload {
  id: string;
}

export const addSchool = createAsyncThunk(
  "schools/addSchool",
  async ({ schoolDto, filters }: AddSchoolPayload, { dispatch }) => {
    const response = await schoolApi.create(schoolDto);
    dispatch(fetchSchools(filters));
    return response.data.data;
  }
);

export const editSchool = createAsyncThunk(
  "schools/editSchool",
  async ({ school, filters }: EditSchoolPayload, { dispatch }) => {
    await schoolApi.update(school.id, school);
    dispatch(fetchSchools(filters));
    return school;
  }
);

export const removeSchool = createAsyncThunk(
  "schools/removeSchool",
  async ({ id, filters }: RemoveSchoolPayload, { dispatch }) => {
    await schoolApi.delete(id);
    dispatch(fetchSchools(filters));
    return id;
  }
);

const schoolsSlice = createSlice({
  name: "schools",
  initialState,
  reducers: {
    openModalForCreate: (state) => {
      state.isModalOpen = true;
      state.editingSchool = null;
    },
    openModalForEdit: (state, action: PayloadAction<School>) => {
      state.isModalOpen = true;
      state.editingSchool = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingSchool = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchools.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchSchools.fulfilled,
        (state, action: PayloadAction<PagedResult<School>>) => {
          state.isLoading = false;
          state.pagedSchools = action.payload;
        }
      )
      .addCase(fetchSchools.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addMatcher(
        (action) =>
          [
            addSchool.pending,
            editSchool.pending,
            removeSchool.pending,
          ].includes(action.type),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            addSchool.fulfilled,
            editSchool.fulfilled,
            removeSchool.fulfilled,
            addSchool.rejected,
            editSchool.rejected,
            removeSchool.rejected,
          ].includes(action.type),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { openModalForCreate, openModalForEdit, closeModal } =
  schoolsSlice.actions;
export default schoolsSlice.reducer;
