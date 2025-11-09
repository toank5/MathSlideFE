import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { chapterApi } from "./chapterApi";
import type { PagedResult } from "../school/school";
import type { Chapter, ChapterDto } from "./chapter";

interface ChaptersState {
  pagedChapters: PagedResult<Chapter> | null;
  chapterList: Chapter[];
  chaptersForSelection: Chapter[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingChapter: Chapter | null;
}

const initialState: ChaptersState = {
  pagedChapters: { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 },
  chapterList: [],
  chaptersForSelection: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
  editingChapter: null,
};

interface FetchChaptersPayload {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  gradeId?: string;
}

export const fetchChaptersByGrade = createAsyncThunk(
  "chapters/fetchChaptersByGrade",
  async (gradeId: string, { rejectWithValue }) => {
    try {
      const chapters = await chapterApi.getByGradeId(gradeId);
      return chapters;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchChapters = createAsyncThunk(
  "chapters/fetchChapters",
  async (params: FetchChaptersPayload) => {
    const response = await chapterApi.getPaged(params);
    return response;
  }
);

export const fetchChapterList = createAsyncThunk(
  "chapters/fetchChapterList",
  async () => {
    const chapterList = await chapterApi.getAll();
    return chapterList;
  }
);
interface MutatePayload {
  filters: FetchChaptersPayload;
}
interface AddChapterPayload extends MutatePayload { dto: ChapterDto; }
interface EditChapterPayload extends MutatePayload { chapter: Chapter; }
interface RemoveChapterPayload extends MutatePayload { id: string; }


export const addChapter = createAsyncThunk(
  "chapters/addChapter",
  async ({ dto, filters }: AddChapterPayload, { dispatch }) => {
    await chapterApi.create(dto);
    dispatch(fetchChapters(filters));
  }
);
export const editChapter = createAsyncThunk(
  "chapters/editChapter",
  async ({ chapter, filters }: EditChapterPayload, { dispatch }) => {
    await chapterApi.update(chapter.id, chapter);
    dispatch(fetchChapters(filters));
  }
);
export const removeChapter = createAsyncThunk(
  "chapters/removeChapter",
  async ({ id, filters }: RemoveChapterPayload, { dispatch }) => {
    await chapterApi.delete(id);
    dispatch(fetchChapters(filters));
  }
);

const chaptersSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {
    openModalForCreate: (state) => {
      state.isModalOpen = true;
      state.editingChapter = null;
    },
    openModalForEdit: (state, action: PayloadAction<Chapter>) => {
      state.isModalOpen = true;
      state.editingChapter = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingChapter = null;
    },
    clearChaptersForSelection: (state) => {
      state.chaptersForSelection = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChapters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pagedChapters = action.payload;
      })
      .addCase(fetchChaptersByGrade.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChaptersByGrade.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chaptersForSelection = action.payload;
      })
      .addCase(fetchChaptersByGrade.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(fetchChapters.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchChapterList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchChapterList.fulfilled,
        (state, action: PayloadAction<Chapter[]>) => {
          state.isLoading = false;
          state.chapterList = action.payload;
        }
      )
      .addCase(fetchChapterList.rejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        (action) =>
          [
            addChapter.pending,
            editChapter.pending,
            removeChapter.pending,
          ].includes(action.type),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            addChapter.fulfilled,
            editChapter.fulfilled,
            removeChapter.fulfilled,
            addChapter.rejected,
            editChapter.rejected,
            removeChapter.rejected,
          ].includes(action.type),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { openModalForCreate, openModalForEdit, closeModal, clearChaptersForSelection } = chaptersSlice.actions;
export default chaptersSlice.reducer;
