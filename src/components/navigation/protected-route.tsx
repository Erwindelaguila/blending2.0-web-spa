'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/auth-provider';
import { AppSkeleton } from '@/components/ui/app-skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, login } = useAuthContext();


  useEffect(() => {
    if (isLoading) return;

    if (!user?.isAuthenticated) {
      console.log('Usuario no autenticado, iniciando login...');
      login();
      return;
    }
    
    console.log('Usuario autenticado:', user.profile?.displayName);
  }, [user, isLoading, login]);


  if (isLoading) {
    return <AppSkeleton />;
  }


  if (!user?.isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AppSkeleton />
          <p className="mt-4 text-gray-600">Iniciando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
