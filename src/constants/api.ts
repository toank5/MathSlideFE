// src/constants/api.ts
export const BE_URL: string = import.meta.env.VITE_BACKEND_URL as string;
export const VERSION: string = "v1";

export const API = {
  BASE: `${BE_URL}/api`,

  AUTH: "/Auth",
  USER: "/Users",
  SCHOOL: "/Schools",
  GRADE: "/Grades",
  CLASS: "/Classes",
  LESSON: "/Lessons",
  CHAPTER: "/Chapters",
};
