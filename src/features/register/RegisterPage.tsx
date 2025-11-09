import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  registerUser,
  resetRegistrationStatus,
} from "@/features/auth/authSlice";
import type { RegisterDto } from "../auth/user";
import { RegisterForm } from "@/components/RegisterForm";
import { useToast } from "@/components/ToastProvider";

const RegisterPage: React.FC = () => {
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, registrationSuccess } = useAppSelector(
    (state) => state.auth
  );

  const hasShownSuccessToast = useRef(false);

  useEffect(() => {
    if (registrationSuccess && !hasShownSuccessToast.current) {
      hasShownSuccessToast.current = true;

      showToast({
        type: "success",
        message: "Đăng ký thành công!",
        description: "Tài khoản của bạn đang chờ duyệt. Vui lòng đăng nhập sau.",
      });

      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate, showToast]);

  useEffect(() => {
    if (error) {
      showToast({
        type: "error",
        message: "Đăng ký thất bại",
        description: error,
      });
      dispatch(resetRegistrationStatus());
    }
  }, [error, dispatch, showToast]);

  useEffect(() => {
    return () => {
      dispatch(resetRegistrationStatus());
    };
  }, [dispatch]);

  const handleRegister = (data: RegisterDto) => {
    hasShownSuccessToast.current = false;
    dispatch(registerUser(data));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Tạo tài khoản mới
        </h2>
        <RegisterForm onSubmit={handleRegister} isLoading={loading} />
        <p className="text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;