export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  isAuthenticated: boolean;
}

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

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  accessToken: string | null;
  menu: MenuItem[];
  userInfo: UserInfo | null;
  isMenuLoading: boolean;
  menuError: string | null;
  isAppLoading: boolean;
  isProcessingCallback: boolean;
  callbackPhase: 'idle' | 'processing' | 'loading' | 'complete';
}
