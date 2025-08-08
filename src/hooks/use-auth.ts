import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { 
  loginUser, 
  logoutUser, 
  refreshUserToken,
  clearError 
} from '@/lib/store/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { 
    user, 
    isLoading, 
    isInitialized, 
    error, 
    accessToken, 
    isAppLoading, 
    isProcessingCallback, 
    callbackPhase 
  } = useAppSelector((state) => state.auth);  
  const login = async () => {
    await dispatch(loginUser());
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const forceRefresh = async () => {
    await dispatch(refreshUserToken());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isLoading,
    isInitialized,
    error,
    accessToken,
    isAppLoading,
    isProcessingCallback,
    callbackPhase,
    login,
    logout,
    forceRefresh,
    clearError: clearAuthError,
  };
}
