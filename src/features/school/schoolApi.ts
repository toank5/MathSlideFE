import axiosClient from "@/api/axiosClient";
import { API } from "@/constants/api";
import type { PagedResult, School, SchoolDropdown, SchoolDto } from "./school";
import type { BaseResponse } from "@/types/api";

interface GetSchoolsParams {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
}

export const schoolApi = {
  getPaged: async (params: GetSchoolsParams): Promise<PagedResult<School>> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== '' && value != null)
    );
    const res = await axiosClient.get<BaseResponse<PagedResult<School>>>(
      `${API.SCHOOL}/paged`,
      { params: filteredParams }
    );
    return res.data.data!;
  },

  create: (data: SchoolDto) => {
    return axiosClient.post<BaseResponse<School>>(`${API.SCHOOL}`, data);
  },

  update: (id: string, data: School) => {
    return axiosClient.put<BaseResponse<null>>(`${API.SCHOOL}/${id}`, data);
  },

  delete: (id: string) => {
    return axiosClient.delete<BaseResponse<null>>(`${API.SCHOOL}/${id}`);
  },
  getAll: async (): Promise<School[]> => {
      const response = await axiosClient.get<BaseResponse<School[]>>(`${API.SCHOOL}`);
      return response.data.data!;
    },
    getSchoolNames: async (): Promise<SchoolDropdown[]> => {
    const response = await axiosClient.get<BaseResponse<SchoolDropdown[]>>(`${API.SCHOOL}/SchoolNames`);
    console.log('Fetched school names:', response.data.data);
    return response.data.data!;
  },
};

