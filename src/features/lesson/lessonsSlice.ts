import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { lessonApi } from './lessonApi';
import type { PagedResult } from '../school/school';
import type { Lesson, LessonDto } from './lesson';

interface LessonsState {
  pagedLessons: PagedResult<Lesson>;
  lessonList: Lesson[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingLesson: Lesson | null;
}

const initialState: LessonsState = {
  pagedLessons: { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 },
  lessonList: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
  editingLesson: null,
};

interface FetchLessonsPayload {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  gradeId?: string;
  chapterId?: string;
}
interface MutateLessonsPayload {
  filters: {
    pageIndex: number;
    pageSize: number;
    keyword?: string;
    gradeId?: string;
    chapterId?: string;
  }
}

interface AddLessonPayload extends MutateLessonsPayload { lessonDto: LessonDto; }
interface EditLessonPayload extends MutateLessonsPayload { lesson: Lesson; }
interface RemoveLessonPayload extends MutateLessonsPayload { id: string; }

// Async Thunks
export const fetchLessons = createAsyncThunk(
  'lessons/fetchLessons',
  async (params: FetchLessonsPayload, { rejectWithValue }) => {
    try {
      const pagedResult = await lessonApi.getPaged(params);
      return pagedResult;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch lessons');
    }
  }
);

export const fetchLessonList = createAsyncThunk(
  'lessons/fetchChapterList',
  async () => {
    const lessonList = await lessonApi.getAll();
    return lessonList;
  }
);

export const addLesson = createAsyncThunk('lessons/addLesson', async ({ lessonDto, filters }: AddLessonPayload, { dispatch }) => {
  await lessonApi.create(lessonDto);
  dispatch(fetchLessons(filters));
});

export const editLesson = createAsyncThunk('lessons/editLesson', async ({ lesson, filters }: EditLessonPayload, { dispatch }) => {
  await lessonApi.update(lesson.id, lesson);
  dispatch(fetchLessons(filters));
});

export const removeLesson = createAsyncThunk('lessons/removeLesson', async ({ id, filters }: RemoveLessonPayload, { dispatch }) => {
  await lessonApi.delete(id);
  dispatch(fetchLessons(filters));
});

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    openModalForCreate: (state) => {
      state.isModalOpen = true;
      state.editingLesson = null;
    },
    openModalForEdit: (state, action: PayloadAction<Lesson>) => {
      state.isModalOpen = true;
      state.editingLesson = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingLesson = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => { state.isLoading = true; })
      .addCase(fetchLessons.fulfilled, (state, action: PayloadAction<PagedResult<Lesson>>) => {
        state.isLoading = false;
        state.pagedLessons = action.payload;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addMatcher(
        (action) => [addLesson.pending, editLesson.pending, removeLesson.pending].includes(action.type),
        (state) => { state.isLoading = true; state.error = null; }
      )
      .addMatcher(
        (action) => [addLesson.fulfilled, editLesson.fulfilled, removeLesson.fulfilled, addLesson.rejected, editLesson.rejected, removeLesson.rejected].includes(action.type),
        (state) => { state.isLoading = false; }
      );
  },
});

export const { openModalForCreate, openModalForEdit, closeModal } = lessonsSlice.actions;
export default lessonsSlice.reducer;