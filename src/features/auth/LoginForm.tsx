// src/components/auth/LoginForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import type { LoginRequest } from './user';
import { FormInput } from '../../components/FormInput';

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => void;
  isLoading: boolean;
  apiError?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, apiError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();
  
const passwordLabel = (
  <>
    Mật khẩu <span className="text-red-500">*</span>
  </>
);
const userLabel = (
  <>
    Email <span className="text-red-500">*</span>
  </>
);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
   <FormInput<LoginRequest>
        id="username"
        label={userLabel}
        register={register}
        error={errors.username}
        validationSchema={{
          required: 'Email là bắt buộc',
        }}
      />
      <FormInput<LoginRequest>
      id="password"
      label={passwordLabel}
      type="password"
      register={register}
      error={errors.password}
      validationSchema={{ required: 'Mật khẩu là bắt buộc' }}
    />
      {apiError && <p className="text-sm text-red-600">{apiError}</p>}
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
};