/**
 * 🎯 FRONTEND SIMPLIFICADO - MEJORES PRÁCTICAS
 * 
 * Solo se encarga de:
 * 1. Autenticarse con Azure AD
 * 2. Obtener token JWT
 * 3. Enviar token al backend
 * 4. Mostrar lo que el backend devuelve
 */

'use client';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import type { IAuthenticatedUser } from '@/interface/auth';
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    initializeMsal();
  }, []);

  const initializeMsal = async () => {
    try {
      console.log('🔵 Inicializando MSAL...');
      const instance = new PublicClientApplication(msalConfig);
      await instance.initialize();
      setMsalInstance(instance);
      
      // Manejar respuesta de redirección
      const response = await instance.handleRedirectPromise();
      
      if (response) {
        console.log('✅ Login exitoso');
        await loadUserData(instance, response.account);
      } else {
        // Verificar si hay cuenta existente
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          console.log('✅ Cuenta existente encontrada');
          await loadUserData(instance, accounts[0]);
        }
      }
    } catch (error) {
      console.error('❌ Error inicializando MSAL:', error);
      setError('Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (instance: PublicClientApplication, account: AccountInfo) => {
    try {
      setIsLoading(true);
      
      // ✅ SIMPLE: Solo obtener token JWT
      const silentRequest = {
        scopes: loginRequest.scopes,
        account: account,
      };

      const response = await instance.acquireTokenSilent(silentRequest);
      
      // ✅ SIMPLE: Guardar token
      if (response.accessToken) {
        sessionStorage.setItem('azure-ad-token', response.accessToken);
        console.log('✅ Token guardado');
      }

      // ✅ SIMPLE: Usuario básico - EL BACKEND HARÁ EL RESTO
      const basicUser: IAuthenticatedUser = {
        profile: {
          displayName: account.name || 'Usuario',
          givenName: '',
          surname: '',
          userPrincipalName: account.username,
          mail: account.username,
          id: account.localAccountId || account.homeAccountId,
        },
        role: 'user', // El backend determinará el rol real
        groups: [], // El backend obtendrá los grupos desde Microsoft Graph
        permissions: {
          dashboard: true, // Mínimos permisos
          configuraciones: false,
          consultas: false,
          mantenimientos: false,
          modelos: false,
        },
        accessibleModules: [], // El backend determinará los módulos
        isAuthenticated: true,
      };

      setUser(basicUser);
      console.log('✅ Usuario autenticado (básico)');
      
    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
      setError('Error cargando datos del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (!msalInstance) return;

    try {
      setIsLoading(true);
      await msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError('Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!msalInstance) return;

    try {
      setIsLoading(true);
      
      // Limpiar tokens
      sessionStorage.removeItem('azure-ad-token');
      localStorage.removeItem('azure-ad-token');
      
      await msalInstance.logoutPopup({
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
      });
      
      setUser(null);
    } catch (error) {
      console.error('❌ Error en logout:', error);
      setError('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const forceRefresh = async () => {
    if (!msalInstance) return;

    try {
      setIsLoading(true);
      const accounts = msalInstance.getAllAccounts();
      
      if (accounts.length > 0) {
        const silentRequest = {
          scopes: loginRequest.scopes,
          account: accounts[0],
          forceRefresh: true,
        };
        
        try {
          await msalInstance.acquireTokenSilent(silentRequest);
          await loadUserData(msalInstance, accounts[0]);
        } catch {
          await msalInstance.loginRedirect(loginRequest);
        }
      } else {
        await msalInstance.loginRedirect(loginRequest);
      }
    } catch (error) {
      console.error('❌ Error refrescando:', error);
      setError('Error al refrescar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      logout,
      forceRefresh,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 🎯 SERVICIO DE MENÚ SIMPLIFICADO
 */
export class SimpleUserMenuService {
  static async getUserMenu(): Promise<any> {
    try {
      console.log('🔵 Obteniendo menú del usuario...');
      
      // ✅ SIMPLE: Solo enviar token al backend
      const response = await api.get('http://localhost:7071/api/core/user/menu');
      
      console.log('✅ Menú obtenido desde backend:', {
        success: response.data.Success,
        userRoles: response.data.Data?.UserInfo?.Roles,
        menuItems: response.data.Data?.Menu?.length
      });
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error obteniendo menú:', error);
      throw error;
    }
  }

  static async refreshUserMenu(): Promise<any> {
    const response = await api.get('http://localhost:7071/api/core/user/menu', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.data;
  }
}

/**
 * 🎯 RESUMEN DEL FLUJO SIMPLIFICADO:
 * 
 * 1. ✅ Frontend autentica con Azure AD
 * 2. ✅ Frontend obtiene token JWT
 * 3. ✅ Frontend envía token al backend
 * 4. ✅ Backend valida token
 * 5. ✅ Backend consulta Microsoft Graph
 * 6. ✅ Backend mapea grupos → roles
 * 7. ✅ Backend filtra menú
 * 8. ✅ Backend devuelve menú personalizado
 * 9. ✅ Frontend muestra el menú
 * 
 * VENTAJAS:
 * - ✅ Frontend simple y enfocado
 * - ✅ Backend maneja toda la lógica
 * - ✅ Una sola fuente de verdad
 * - ✅ Fácil de mantener
 * - ✅ Más seguro
 * - ✅ Mejor performance
 */
