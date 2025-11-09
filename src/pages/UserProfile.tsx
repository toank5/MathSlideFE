// src/pages/UserProfile.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProfile } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userProfile, profileLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (profileLoading) {
    return <div>Đang tải hồ sơ...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!userProfile) {
    return <div>Không tìm thấy thông tin người dùng.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Hồ sơ cá nhân</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600">Họ và tên:</label>
          <p className="text-lg text-gray-900">{userProfile.fullName}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Tên đăng nhập:</label>
          <p className="text-lg text-gray-900">{userProfile.username}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Email:</label>
          <p className="text-lg text-gray-900">{userProfile.email}</p>
        </div>
        {userProfile.phoneNumber && (
          <div>
            <label className="text-sm font-semibold text-gray-600">Số điện thoại:</label>
            <p className="text-lg text-gray-900">{userProfile.phoneNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;