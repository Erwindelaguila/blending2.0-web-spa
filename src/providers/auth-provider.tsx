'use client';
import React, { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { initializeAuth, loadUserMenu, setAppLoadingComplete } from '@/lib/store/slices/authSlice';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { isInitialized, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuth());
    } else if (user?.isAuthenticated) {
      dispatch(loadUserMenu());
    } else {
      const timer = setTimeout(() => {
        dispatch(setAppLoadingComplete());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isInitialized, user?.isAuthenticated]);

  return <>{children}</>;
}