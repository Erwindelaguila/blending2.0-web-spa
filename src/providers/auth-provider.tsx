'use client';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { jwtDecode } from 'jwt-decode';
import type { IAuthenticatedUser, IAzureGroup, UserRole } from '@/interface/auth';
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
        console.log('🔵 Inicializando MSAL...');
        const instance = new PublicClientApplication(msalConfig);
        await instance.initialize();
        setMsalInstance(instance);
        console.log('✅ MSAL inicializado correctamente');

        // Manejar la respuesta de redirección si existe
        console.log('🔵 Verificando respuesta de redirección...');
        const response = await instance.handleRedirectPromise();
        
        if (response) {
          console.log('✅ Respuesta de redirección encontrada:', {
            account: response.account?.username,
            scopes: response.scopes,
            tokenType: response.tokenType
          });
          // Cargar datos del usuario después de login exitoso
          await loadUserData(instance, response.account);
        } else {
          console.log('🔵 No hay respuesta de redirección, verificando cuentas existentes...');
          // Verificar si hay una cuenta existente
          const accounts = instance.getAllAccounts();
          console.log('📊 Cuentas encontradas:', accounts.length);
          
          if (accounts.length > 0) {
            console.log('✅ Cuenta existente encontrada:', accounts[0].username);
            await loadUserData(instance, accounts[0]);
          } else {
            console.log('⚠️ No hay cuentas existentes');
          }
        }
      } catch (error) {
        console.error('❌ Error al inicializar MSAL:', error);
        setError('Error al inicializar la autenticación');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMsal();
  }, []);

  const loadUserData = async (instance: PublicClientApplication, account: AccountInfo) => {
    try {
      console.log('🔵 Cargando datos del usuario:', account.username);
      setIsLoading(true);
      
      // ✅ MEJORES PRÁCTICAS: Solo obtener token JWT para el backend
      const silentRequest = {
        scopes: loginRequest.scopes,
        account: account,
      };

      console.log('🔵 Solicitando token con scopes:', loginRequest.scopes);
      const response = await instance.acquireTokenSilent(silentRequest);
      console.log('✅ Token JWT obtenido exitosamente');

      // ✅ MEJORES PRÁCTICAS: Guardar token para que el backend lo use
      if (response.accessToken) {
        sessionStorage.setItem('azure-ad-token', response.accessToken);
        console.log('✅ Token guardado para el backend');
        
        // Debug: Mostrar información básica del token
        try {
          const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
          console.log('📊 Token info:', {
            aud: payload.aud,
            exp: new Date(payload.exp * 1000).toISOString(),
            upn: payload.upn || payload.preferred_username
          });
        } catch (e) {
          console.log('⚠️ No se pudo decodificar el token para debugging');
        }
      }

      // ✅ MEJORES PRÁCTICAS: Usuario básico - EL BACKEND DETERMINARÁ TODO LO DEMÁS
      const authenticatedUser: IAuthenticatedUser = {
        profile: {
          displayName: account.name || 'Usuario',
          givenName: '',
          surname: '',
          userPrincipalName: account.username,
          mail: account.username,
          id: account.localAccountId || account.homeAccountId,
        },
        role: 'user', // Rol básico - el backend determinará el real usando Microsoft Graph
        groups: [], // Vacío - el backend obtendrá los grupos desde Microsoft Graph
        permissions: {
          dashboard: true, // Solo dashboard básico hasta que el backend responda
          configuraciones: false,
          consultas: false,
          mantenimientos: false,
          modelos: false,
        },
        accessibleModules: [], // Vacío - el backend determinará los módulos
        isAuthenticated: true,
      };

      console.log('✅ Usuario autenticado (básico) creado:', {
        displayName: authenticatedUser.profile.displayName,
        email: authenticatedUser.profile.userPrincipalName,
        note: 'El backend determinará roles, grupos y permisos usando Microsoft Graph'
      });
      
      setUser(authenticatedUser);
    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
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
      
      // Limpiar tokens del almacenamiento
      sessionStorage.removeItem('azure-ad-token');
      localStorage.removeItem('azure-ad-token');
      
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