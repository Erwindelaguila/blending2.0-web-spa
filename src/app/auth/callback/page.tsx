'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { handleAuthCallback, completeCallback } from '@/lib/store/slices/authSlice';

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('🔄 Procesando callback de autenticación...');
        await dispatch(handleAuthCallback()).unwrap();
        dispatch(completeCallback());
        console.log('✅ Callback procesado exitosamente');
      } catch (error) {
        console.error('❌ Error en callback:', error);
      } finally {
        router.replace('/');
      }
    };

    processCallback();
  }, [dispatch, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  );
}
