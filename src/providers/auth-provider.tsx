'use client';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { jwtDecode } from 'jwt-decode';
import type { IAuthenticatedUser } from '@/interface/auth';
import { 
  getUserRolesFromGroups, 
  getPrimaryRole, 
  getAccessibleModules, 
  getPermissionsFromRoles
} from '@/utils/azure-group-mapping';
import { msalConfig, loginRequest } from '@/config/auth.config';

interface AuthContextType {
  user: IAuthenticatedUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Alias para conveniencia
export const useAuth = useAuthContext;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IAuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  // Inicializar MSAL solo en el cliente
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        const instance = new PublicClientApplication(msalConfig);
        await instance.initialize();
        setMsalInstance(instance);

        // Manejar la respuesta de redirección si existe
        const response = await instance.handleRedirectPromise();
        
        if (response) {
          // Cargar datos del usuario después de login exitoso
          await loadUserData(instance, response.account);
        } else {
          // Verificar si hay una cuenta existente
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            await loadUserData(instance, accounts[0]);
          }
        }
      } catch (error) {
        setError('Error al inicializar la autenticación');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMsal();
  }, []);

  const loadUserData = async (instance: PublicClientApplication, account: AccountInfo) => {
    try {
      setIsLoading(true);
      
      // Obtener token silenciosamente
      const silentRequest = {
        scopes: loginRequest.scopes,
        account: account,
      };

      const response = await instance.acquireTokenSilent(silentRequest);

      // Obtener información desde el ID token (donde están los grupos y perfil)
      let decodedToken: any = null;
      
      if (response.idToken) {
        decodedToken = jwtDecode(response.idToken);
      } else if (response.accessToken) {
        decodedToken = jwtDecode(response.accessToken);
      }

      // Crear perfil del usuario desde el token
      const userProfile = {
        displayName: decodedToken?.name || account.name || 'Usuario',
        givenName: decodedToken?.given_name || '',
        surname: decodedToken?.family_name || '',
        userPrincipalName: decodedToken?.upn || account.username,
        mail: decodedToken?.email || account.username,
        id: decodedToken?.oid || account.localAccountId,
      };

      // Obtener grupos desde el token
      const userGroups: string[] = decodedToken?.groups || [];

      // Mapear grupos a roles y módulos
      const userRoles = getUserRolesFromGroups(userGroups);
      const primaryRole = getPrimaryRole(userRoles);
      const accessibleModules = getAccessibleModules(userRoles);
      const permissions = getPermissionsFromRoles(userRoles);

      // Crear usuario autenticado
      const authenticatedUser: IAuthenticatedUser = {
        profile: userProfile,
        role: primaryRole,
        groups: userGroups.map(id => ({ id, displayName: `Group-${id}` })),
        permissions,
        accessibleModules,
        isAuthenticated: true,
      };

      setUser(authenticatedUser);
    } catch (error) {
      setError('Error al cargar los datos del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (!msalInstance) {
      setError('MSAL no está inicializado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      setError('Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!msalInstance) return;

    try {
      setIsLoading(true);
      await msalInstance.logoutPopup({
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
      });
      setUser(null);
    } catch (error) {
      setError('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const forceRefresh = async () => {
    if (!msalInstance) {
      setError('MSAL no está inicializado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        const silentRequest = {
          scopes: loginRequest.scopes,
          account: accounts[0],
          forceRefresh: true,
        };
        
        try {
          const response = await msalInstance.acquireTokenSilent(silentRequest);
          await loadUserData(msalInstance, accounts[0]);
        } catch (silentError) {
          await msalInstance.loginRedirect(loginRequest);
        }
      } else {
        await msalInstance.loginRedirect(loginRequest);
      }
    } catch (error) {
      setError('Error al refrescar la autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    forceRefresh,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}