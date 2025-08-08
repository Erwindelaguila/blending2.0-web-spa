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
        await dispatch(handleAuthCallback()).unwrap();
        dispatch(completeCallback());
      } finally {
        router.replace('/');
      }
    };

    processCallback();
  }, []);

  return null;
}
