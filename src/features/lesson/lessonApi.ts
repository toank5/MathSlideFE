import axiosClient from "@/api/axiosClient";
import { API } from "@/constants/api";
import type { PagedResult } from "../school/school";
import type { Lesson, LessonDto } from "./lesson";
import type { BaseResponse } from "@/types/api";

type GetLessonsParams = {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  gradeId?: string;
  chapterId?: string;
};

export const lessonApi = {
  getPaged: async (params: GetLessonsParams): Promise<PagedResult<Lesson>> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== '' && value != null)
    );
    const response = await axiosClient.get<BaseResponse<PagedResult<Lesson>>>(`${API.LESSON}/paged`, { params: filteredParams });
    return response.data.data!;
  },
  create: (data: LessonDto) =>
    axiosClient.post<BaseResponse<Lesson>>(`${API.LESSON}`, data),
  update: (id: string, data: Lesson) =>
    axiosClient.put<BaseResponse<null>>(`${API.LESSON}/${id}`, data),
  delete: (id: string) =>
    axiosClient.delete<BaseResponse<null>>(`${API.LESSON}/${id}`),
  getAll: async (): Promise<Lesson[]> => {
      const response = await axiosClient.get<BaseResponse<Lesson[]>>(`${API.LESSON}`);
      return response.data.data!;
    },
  getByChapterId: async (chapterId: string): Promise<Lesson[]> => {
    const response = await axiosClient.get<BaseResponse<Lesson[]>>(`${API.LESSON}/by-chapter/${chapterId}`);
    return response.data.data!;
  },
};