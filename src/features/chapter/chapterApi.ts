import axiosClient from "@/api/axiosClient";
import { API } from "@/constants/api";
import type { PagedResult } from "../school/school";
import type { Chapter, ChapterDto } from "./chapter";
import type { BaseResponse } from "@/types/api";

interface GetChaptersParams {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  gradeId?: string;
}

export const chapterApi = {
  getPaged: async (params: GetChaptersParams): Promise<PagedResult<Chapter>> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== '' && value != null)
    );
    const res = await axiosClient.get<BaseResponse<PagedResult<Chapter>>>(
      `${API.CHAPTER}/paged`,
      { params: filteredParams }
    );
    return res.data.data!;
  },

  getAll: async (): Promise<Chapter[]> => {
    const res = await axiosClient.get<BaseResponse<Chapter[]>>(`${API.CHAPTER}`);
    return res.data.data ?? [];
  },

  create: async (data: ChapterDto): Promise<BaseResponse<Chapter>> => {
    const res = await axiosClient.post<BaseResponse<Chapter>>(
      `${API.CHAPTER}/create`,
      data
    );
    return res.data;
  },

  update: async (id: string, data: Chapter): Promise<BaseResponse<null>> => {
    const res = await axiosClient.put<BaseResponse<null>>(
      `${API.CHAPTER}/${id}`,
      data
    );
    return res.data;
  },

  delete: async (id: string): Promise<BaseResponse<null>> => {
    const res = await axiosClient.delete<BaseResponse<null>>(
      `${API.CHAPTER}/${id}`
    );
    return res.data;
  },

  getByGradeId: async (gradeId: string): Promise<Chapter[]> => {
    const res = await axiosClient.get<BaseResponse<Chapter[]>>(
      `${API.CHAPTER}/by-grade/${gradeId}`
    );
    return res.data.data ?? [];
  },
};
