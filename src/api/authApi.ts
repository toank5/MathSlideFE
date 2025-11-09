import axios from "axios";
import type { LoginRequest, RegisterDto, User } from "../features/auth/user";
import { API } from "../constants/api";
import type { BaseResponse } from "@/types/api";
import type { PagedResult } from "@/features/school/school";
import { mapRoles } from "@/lib/roleMapper";

export const authApi = {
  login: (data: LoginRequest) =>
    axios.post(`${API.BASE}/Auth/login`, data, { withCredentials: true }),

  logout: () =>
    axios.post(`${API.BASE}/Auth/logout`, {}, { withCredentials: true }),

 me: async (): Promise<User> => {
    const res = await axios.get<Omit<User, "roles"> & { roles: string[] }>(
      `${API.BASE}/Auth/me`,
      { withCredentials: true }
    );

    const user: User = {
      ...res.data,
      roles: mapRoles(res.data.roles),
    };

    return user;
  },
  register: (data: RegisterDto) =>
    axios.post<BaseResponse<User>>(`${API.BASE}${API.USER}/register`, data, { withCredentials: true }),

  getPendingUsers: async (
    pageIndex: number,
    pageSize: number
  ): Promise<PagedResult<User>> => {
    const params = { pageIndex, pageSize };
    const res = await axios.get<BaseResponse<PagedResult<User>>>(
      `${API.USER}/GetUsersPending`,
      { params }
    );
    return res.data.data!;
  },

  acceptUser: async (userId: string): Promise<any> => {
    const response = await axios.put<BaseResponse<object>>(`${API.USER}/${userId}/accept`);
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await axios.get<User>(`${API.BASE}/Auth/profile`, {
      withCredentials: true,
    });
    return response.data;
  },
};
