import type { UserRole } from '@/config/auth.config';

export type { UserRole };

export interface IAzureUser {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
  jobTitle?: string;
  mobilePhone?: string;
  officeLocation?: string;
}

export interface IAzureGroup {
  id: string;
  displayName: string;
  description?: string;
  mail?: string;
  mailNickname?: string;
}

export interface IAuthenticatedUser {
  profile: IAzureUser;
  role: UserRole;
  groups: IAzureGroup[];
  permissions: {
    configuraciones: boolean;
    consultas: boolean;
    mantenimientos: boolean;
    modelos: boolean;
    dashboard: boolean;
  };
  accessibleModules: string[]; // Módulos que el usuario puede ver
  isAuthenticated: boolean;
}

export interface IAuthState {
  user: IAuthenticatedUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface IAuthContext extends IAuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  acquireToken: () => Promise<string | null>;
}
