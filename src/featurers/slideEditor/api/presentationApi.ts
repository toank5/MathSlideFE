import axiosClient from "@/api/axiosClient";
import type { Presentation } from "../types/types";
import type { BaseResponse } from "@/types/api";

export const presentationApi = {
  update: (id: string, data: Presentation) => {
    return axiosClient.put<BaseResponse<Presentation>>(`/presentation/${id}`, data);
  },
  get: async (id: string): Promise<Presentation> => {
    const response = await axiosClient.get<BaseResponse<Presentation>>(`/presentation/${id}`);
    return response.data.data;
  },
  post: (lessonId: string, title: string) => {
    return axiosClient.post<BaseResponse<Presentation>>(`/presentation`, { lessonId, title });
  },
  getShowslide: async (id: string): Promise<Presentation> => {
    const response = await axiosClient.get<BaseResponse<Presentation>>(`/presentation/show-slide/${id}`);
    return response.data.data;
  },
  delete: async (id: string) => {
    return axiosClient.delete<BaseResponse<null>>(`/presentation/${id}`);
  },
};
