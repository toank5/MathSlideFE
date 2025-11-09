import axiosClient from "@/api/axiosClient";
import { API } from "@/constants/api";
import type { PagedResult } from "../school/school";
import type { User } from "../auth/user";
import type { BaseResponse } from "@/types/api";

export enum UserStatus {
  Pending = "Pending",
  Active = "Active",
  Inactive = "Inactive",
}

interface GetUsersParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
  status?: UserStatus;
}

export const userApi = {
  getUsers: async (params: GetUsersParams): Promise<PagedResult<User>> => {
    const response = await axiosClient.get<BaseResponse<PagedResult<User>>>(`${API.USER}/GetAllUser`, { params });
    return response.data.data!;
  },

  updateUserStatus: async (userId: string, status: UserStatus): Promise<any> => {
    const response = await axiosClient.put<BaseResponse<object>>(`${API.USER}/${userId}/update-status`, null, {
      params: { status }
    });
    return response.data;
  },
};
