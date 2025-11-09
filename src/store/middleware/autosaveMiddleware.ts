// src/store/middleware/autosaveMiddleware.ts
// src/store/middleware/autosaveMiddleware.ts
import type { Middleware } from '@reduxjs/toolkit';
import { autosavePresentation } from '../../featurers/slideEditor/slices/slideEditorSlice';
import type { RootState } from '../store';
import type { Presentation } from '@/featurers/slideEditor/types/types';

// Hàm debounce đơn giản
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
};

// Danh sách các action cần kích hoạt autosave
const actionsToWatch = [
  'slideEditor/updatePresentationTitle',
  'slideEditor/addSlide',
  'slideEditor/removeSlide',
  'slideEditor/reorderSlides',
  'slideEditor/setSlideComponents',
  'slideEditor/addComponent',
  'slideEditor/updateComponentProperties',
  'slideEditor/removeComponent',
  'slideEditor/undo',
  'slideEditor/redo',
];

export const autosaveMiddleware: Middleware<object, RootState> = store => {
  // Tạo một hàm debounced để dispatch action autosave
  const debouncedSave = debounce((presentation: Presentation) => {
    if (presentation) {
      store.dispatch(autosavePresentation(presentation) as any);
    }
  }, 1500); // Đợi 1.5 giây sau hành động cuối cùng

  return next => action => {
    // Cho action đi tiếp đến reducer
    const result = next(action);
    // Nếu action nằm trong danh sách cần theo dõi
    if (actionsToWatch.includes(action.type)) {
      const currentState = store.getState();
      const presentationToSave = currentState.slideEditor.present.presentation;

      // Gọi hàm debounced để lưu
      debouncedSave(presentationToSave);
    }

    return result;
  };
};