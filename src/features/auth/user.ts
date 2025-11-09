export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phoneNumber?: string | null;
  roles: number[];
  userStatus: number;
  schoolId: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  schoolId: string;
  role: number;
}