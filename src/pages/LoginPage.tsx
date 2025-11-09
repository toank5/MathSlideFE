import React from 'react';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, fetchCurrentUser } from '../features/auth/authSlice';
import type { LoginRequest } from '../features/auth/user';
import { LoginForm } from '../features/auth/LoginForm';
import myLogo from '../assets/logo.png';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginRequest) => {
    try {
      const loginAction = await dispatch(login(data));
      unwrapResult(loginAction);

      const userAction = await dispatch(fetchCurrentUser());
      unwrapResult(userAction);
      
      navigate('/');
    } catch (err) {
      console.error('Failed to login or fetch user:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-6xl font-extrabold tracking-tight text-gray-900">
            Math Slides
          </h2>
          <p className="mt-2 text-center text-md text-gray-700">
            Nơi để thiết kế slide môn toán theo bộ giáo dục
          </p>
        </div>
        
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
             <h3 className="text-xl font-bold text-gray-800">Đăng nhập tài khoản</h3>
          </div>
          <LoginForm 
            onSubmit={handleLogin} 
            isLoading={loading} 
            apiError={error} 
          />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-200"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
