import axiosClient from "@/api/axiosClient";
import { API } from "@/constants/api";
import type { PagedResult, Grade, GradeDto } from "./grade";
import type { BaseResponse } from "@/types/api";

export const gradeApi = {
  getPaged: async (
    pageIndex: number,
    pageSize: number
  ): Promise<PagedResult<Grade>> => {
    const res = await axiosClient.get<BaseResponse<PagedResult<Grade>>>(
      `/grades/paged?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data.data!;
  },

  create: (data: GradeDto) => {
    const formData = new FormData();
    formData.append("gradeName", data.gradeName);
    formData.append("displayOrder", data.displayOrder.toString());
    if (data.backgroundImage) {
      formData.append("backgroundImage", data.backgroundImage);
    }

    return axiosClient.post<BaseResponse<Grade>>(
      `${API.GRADE}/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

update: (id: string, data: GradeDto) => {
  const formData = new FormData();
  formData.append("gradeName", data.gradeName);
  formData.append("displayOrder", data.displayOrder.toString());
  
  if (data.backgroundImage) {
    formData.append("backgroundImage", data.backgroundImage);
  }

  return axiosClient.put<BaseResponse<null>>(`${API.GRADE}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
},

  // update: (id: string, data: Grade) => {
  //   return axiosClient.put<BaseResponse<null>>(`${API.GRADE}/${id}`, data);
  // },

  delete: (id: string) => {
    return axiosClient.delete<BaseResponse<null>>(`${API.GRADE}/${id}`);
  },
  getAll: async (): Promise<Grade[]> => {
    const res = await axiosClient.get<BaseResponse<Grade[]>>(`${API.GRADE}`);
    return res.data.data ?? [];
  },
};
