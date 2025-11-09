import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from '../features/auth/authSlice';
import schoolsReducer from '../features/school/schoolsSlice';
import gradesReducer from '../features/grade/gradesSlice';
import lessonsReducer from '../features/lesson/lessonsSlice';
import chaptersReducer from '../features/chapter/chapterSlice';
import slideEditorReducer from '../featurers/slideEditor/slices/slideEditorSlice';
import usersReducer from '../features/user/usersSlice';
import sharedReducer from '../features/shared/sharedSlice';


import { autosaveMiddleware } from './middleware/autosaveMiddleware'; // <-- IMPORT

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    schools: schoolsReducer,
    grades: gradesReducer,
    lessons: lessonsReducer,
    chapters: chaptersReducer,
    slideEditor: slideEditorReducer,
    users: usersReducer,
    shared: sharedReducer,
  },
  // --- THÊM MIDDLEWARE VÀO ĐÂY ---
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(autosaveMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
