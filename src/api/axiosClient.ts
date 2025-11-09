import axios, { HttpStatusCode } from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { BaseResponse } from "../types/api";
import { API } from "../constants/api";

const axiosClient = axios.create({
  baseURL: API.BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const serverData = response.data as BaseResponse<any>;

    const standardizedResponse: BaseResponse<any> = {
      success: serverData?.success ?? true,
      message: serverData?.message || "Request successful",
      data: serverData?.data ?? null,
      httpStatusCode: response.status,
      error: serverData?.error ?? null,
    };

    response.data = standardizedResponse;
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const serverData = error.response.data as Partial<BaseResponse<null>>;
      const errorResponse: BaseResponse<null> = {
        data: null,
        message: serverData?.message || "Có lỗi xảy ra từ server.",
        success: false,
        httpStatusCode: error.response.status,
        error: serverData?.error || [serverData?.message || "Server Error"],
      };
      return Promise.reject(errorResponse);
    } else if (error.request) {
      const networkError: BaseResponse<null> = {
        httpStatusCode: HttpStatusCode.ServiceUnavailable,
        data: null,
        message:
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.",
        success: false,
        error: [error.message],
      };
      return Promise.reject(networkError);
    } else {
      const unknownError: BaseResponse<null> = {
        httpStatusCode: HttpStatusCode.InternalServerError,
        data: null,
        message: "Có lỗi không mong muốn đã xảy ra.",
        success: false,
        error: [error.message],
      };
      return Promise.reject(unknownError);
    }
  }
);

export default axiosClient;
