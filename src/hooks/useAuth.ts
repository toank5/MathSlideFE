// src/hooks/useAuth.ts

import { useAppSelector } from '../store/hooks';

export const useAuth = () => {
  const { 
    isAuthenticated, 
    user, 
    loading, 
    error 
  } = useAppSelector((state) => state.auth);

  return {
    isAuthenticated,
    user,
    isLoading: loading,
    error,
    roles: user?.roles || [],
  };
};