import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { SlideEditorState, Slide, CanvasComponent, ComponentProperties, Presentation, PresentState } from '../types/types';
import { presentationApi } from '../api/presentationApi';

// State ban đầu cho slide editor
const initialState: SlideEditorState = {
  past: [],
  present: {
    presentation: null,
    activeSlideId: null,
    saveStatus: 'idle',
  },
  future: [],
};

export const autosavePresentation = createAsyncThunk(
  'slideEditor/autosavePresentation',
  async (presentation: Presentation, { rejectWithValue }) => {
    try {
      const response = await presentationApi.update(presentation.id, presentation);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper để ghi lại trạng thái trước khi thay đổi
const recordHistory = (state: SlideEditorState) => {
    state.past.push(JSON.parse(JSON.stringify(state.present))); // Deep copy
    // Giới hạn lịch sử để tránh tốn bộ nhớ
    if (state.past.length > 30) {
        state.past.shift();
    }
    // Khi có thay đổi mới, lịch sử redo sẽ bị xóa
    state.future = [];
}

const slideEditorSlice = createSlice({
  name: 'slideEditor',
  initialState,
  reducers: {
    // --- Reducers cho Undo/Redo --- //
    undo: (state) => {
      if (state.past.length > 0) {
        state.future.unshift(JSON.parse(JSON.stringify(state.present))); // Deep copy
        state.present = state.past.pop()!;
      }
    },
    redo: (state) => {
        if (state.future.length > 0) {
            state.past.push(JSON.parse(JSON.stringify(state.present))); // Deep copy
            state.present = state.future.shift()!;
        }
    },

    // --- Reducers không cần ghi lại lịch sử --- //

    /**
     * Tải toàn bộ dữ liệu của một bài trình chiếu vào state.
     * Hành động này sẽ xóa toàn bộ lịch sử undo/redo.
     */
    setPresentation: (state, action: PayloadAction<Presentation>) => {
      state.present.presentation = action.payload;
      state.present.presentation.slides.sort((a, b) => a.pageNumber - b.pageNumber);
      state.present.activeSlideId = state.present.presentation.slides[0]?.id ?? null;
      state.present.saveStatus = 'succeeded';
      state.past = [];
      state.future = [];
    },

    /**
     * Thiết lập slide đang hoạt động. Không ảnh hưởng đến lịch sử.
     */
    setActiveSlide: (state, action: PayloadAction<string>) => {
      state.present.activeSlideId = action.payload;
    },

    // --- Reducers CÓ ghi lại lịch sử --- //

    /**
     * Cập nhật tiêu đề của bài trình chiếu.
     */
    updatePresentationTitle: (state, action: PayloadAction<string>) => {
      recordHistory(state);
      if (state.present.presentation) {
        state.present.presentation.title = action.payload;
      }
    },

    /**
     * Thêm một slide mới vào bài trình chiếu.
     */
    addSlide: (state, action: PayloadAction<{ id: string; presentationId: string }>) => {
        recordHistory(state);
        if (!state.present.presentation) return;
        const newPageNumber = state.present.presentation.slides.length > 0
            ? Math.max(...state.present.presentation.slides.map(s => s.pageNumber)) + 1
            : 1;

        const newSlide: Slide = {
            id: action.payload.id,
            presentationId: action.payload.presentationId,
            pageNumber: newPageNumber,
            components: [],
        };
        state.present.presentation.slides.push(newSlide);
        state.present.activeSlideId = newSlide.id;
    },

    /**
     * Xóa một slide khỏi bài trình chiếu.
     */
    removeSlide: (state, action: PayloadAction<{ slideId: string }>) => {
        recordHistory(state);
        if (!state.present.presentation) return;
        const { slideId } = action.payload;
        const slideIndex = state.present.presentation.slides.findIndex(s => s.id === slideId);

        if (slideIndex === -1) return;

        state.present.presentation.slides.splice(slideIndex, 1);

        state.present.presentation.slides
            .sort((a, b) => a.pageNumber - b.pageNumber)
            .forEach((slide, index) => {
                slide.pageNumber = index + 1;
            });

        if (state.present.activeSlideId === slideId) {
            state.present.activeSlideId = state.present.presentation.slides[Math.max(0, slideIndex - 1)]?.id ?? null;
        }
    },

    /**
     * Sắp xếp lại thứ tự các slide.
     */
    reorderSlides: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
        recordHistory(state);
        if (!state.present.presentation) return;
        const { activeId, overId } = action.payload;

        const oldIndex = state.present.presentation.slides.findIndex(s => s.id === activeId);
        const newIndex = state.present.presentation.slides.findIndex(s => s.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;

        const [movedSlide] = state.present.presentation.slides.splice(oldIndex, 1);
        state.present.presentation.slides.splice(newIndex, 0, movedSlide);

        state.present.presentation.slides.forEach((slide, index) => {
            slide.pageNumber = index + 1;
        });
    },

    /**
     * Ghi đè toàn bộ components cho một slide.
     */
    setSlideComponents: (state, action: PayloadAction<{ slideId: string; components: CanvasComponent[] }>) => {
        recordHistory(state);
        if (!state.present.presentation) return;
        const { slideId, components } = action.payload;
        const slide = state.present.presentation.slides.find(s => s.id === slideId);
        if (slide) {
            slide.components = components;
        }
    },

    /**
     * Thêm một component mới vào slide đang hoạt động.
     */
    addComponent: (state, action: PayloadAction<CanvasComponent>) => {
      recordHistory(state);
      if (!state.present.presentation || !state.present.activeSlideId) return;
      const activeSlide = state.present.presentation.slides.find(s => s.id === state.present.activeSlideId);
      if (activeSlide) {
        activeSlide.components.push(action.payload);
      }
    },

    /**
     * Cập nhật thuộc tính của một component cụ thể.
     */
    updateComponentProperties: (state, action: PayloadAction<{ componentId: string; properties: Partial<ComponentProperties> }>) => {
      recordHistory(state);
      if (!state.present.presentation || !state.present.activeSlideId) return;
      const { componentId, properties } = action.payload;
      const activeSlide = state.present.presentation.slides.find(s => s.id === state.present.activeSlideId);
      if (activeSlide) {
        const component = activeSlide.components.find(c => c.id === componentId);
        if (component) {
          component.properties = { ...component.properties, ...properties };
        }
      }
    },

    /**
     * Xóa một component khỏi slide đang hoạt động.
     */
    removeComponent: (state, action: PayloadAction<{ componentId: string }>) => {
      recordHistory(state);
      if (!state.present.presentation || !state.present.activeSlideId) return;
      const { componentId } = action.payload;
      const activeSlide = state.present.presentation.slides.find(s => s.id === state.present.activeSlideId);
      if (activeSlide) {
        activeSlide.components = activeSlide.components.filter(c => c.id !== componentId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(autosavePresentation.pending, (state) => {
        state.present.saveStatus = 'saving';
      })
      .addCase(autosavePresentation.fulfilled, (state) => {
        state.present.saveStatus = 'succeeded';
      })
      .addCase(autosavePresentation.rejected, (state) => {
        state.present.saveStatus = 'failed';
      });
  },
});

export const {
  setPresentation,
  updatePresentationTitle,
  setActiveSlide,
  addSlide,
  removeSlide,
  reorderSlides,
  setSlideComponents,
  addComponent,
  updateComponentProperties,
  removeComponent,
  undo,
  redo,
} = slideEditorSlice.actions;

export default slideEditorSlice.reducer;
