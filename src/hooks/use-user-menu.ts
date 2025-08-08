import { useAppSelector } from '@/lib/store/hooks';

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  iconName?: string;
  items?: MenuItem[];
}

export interface UserInfo {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  roles: string[];
  groups?: string[];
  enlaces?: Record<string, any>;
  permisosUsuario?: string[];
}

export interface UseUserMenuReturn {
  menu: MenuItem[];
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserMenu(): UseUserMenuReturn {
  const { menu, userInfo, isMenuLoading, menuError } = useAppSelector((state) => state.auth);

  return {
    menu,
    userInfo,
    isLoading: isMenuLoading,
    error: menuError,
  };
}
