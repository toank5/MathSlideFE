import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { gradeApi } from './gradeApi';
import type { PagedResult, Grade, GradeDto } from './grade';

interface GradesState {
  pagedGrades: PagedResult<Grade>;
  gradeList: Grade[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingGrade: Grade | null;
}

const initialState: GradesState = {
  pagedGrades: { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 },
  gradeList: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
  editingGrade: null,
};

export const fetchGrades = createAsyncThunk(
  'grades/fetchGrades',
  async (
    { pageIndex, pageSize }: { pageIndex: number; pageSize: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await gradeApi.getPaged(pageIndex, pageSize);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch grades');
    }
  }
);

export const fetchGradeList = createAsyncThunk(
  'grades/fetchGradeList',
  async (_, { rejectWithValue }) => {
    try {
      const gradeList = await gradeApi.getAll();
      return gradeList;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch grade list');
    }
  }
);

export const addGrade = createAsyncThunk(
  'grades/addGrade',
  async (gradeDto: GradeDto, { dispatch }) => {
    const res = await gradeApi.create(gradeDto);
    dispatch(fetchGrades({ pageIndex: 1, pageSize: 10 }));
    return res.data.data;
  }
);

export const editGrade = createAsyncThunk(
  'grades/editGrade',
  async (grade: Grade, { dispatch, getState }) => {
    await gradeApi.update(grade.id, grade);
    const { pageIndex, pageSize } = (getState() as any).grades.pagedGrades;
    dispatch(fetchGrades({ pageIndex, pageSize }));
    return grade;
  }
);

export const removeGrade = createAsyncThunk(
  'grades/removeGrade',
  async (id: string, { dispatch, getState }) => {
    await gradeApi.delete(id);
    const { pageIndex, pageSize } = (getState() as any).grades.pagedGrades;
    dispatch(fetchGrades({ pageIndex, pageSize }));
    return id;
  }
);

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    openModalForCreate: (state) => {
      state.isModalOpen = true;
      state.editingGrade = null;
    },
    openModalForEdit: (state, action: PayloadAction<Grade>) => {
      state.isModalOpen = true;
      state.editingGrade = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingGrade = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrades.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchGrades.fulfilled,
        (state, action: PayloadAction<PagedResult<Grade>>) => {
          state.isLoading = false;
          state.pagedGrades = action.payload;
        }
      )
      .addCase(fetchGrades.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGradeList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGradeList.fulfilled, (state, action: PayloadAction<Grade[]>) => {
        state.isLoading = false;
        state.gradeList = action.payload;
      })
      .addCase(fetchGradeList.rejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(addGrade.pending, editGrade.pending, removeGrade.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          addGrade.fulfilled,
          editGrade.fulfilled,
          removeGrade.fulfilled,
          addGrade.rejected,
          editGrade.rejected,
          removeGrade.rejected
        ),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { openModalForCreate, openModalForEdit, closeModal } =
  gradesSlice.actions;
export default gradesSlice.reducer;
