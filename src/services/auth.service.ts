import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, loginRequest, apiRequest } from '@/config/auth.config';
import { AuthUser } from '@/interface/auth';

export class AuthService {
  private static instance: PublicClientApplication | null = null;

  static async initialize(): Promise<PublicClientApplication> {
    if (!this.instance) {
      this.instance = new PublicClientApplication(msalConfig);
      await this.instance.initialize();
    }
    return this.instance;
  }

  static getInstance(): PublicClientApplication | null {
    return this.instance;
  }

  static async handleRedirectResponse(): Promise<{ user: AuthUser | null; token: string | null }> {
    if (!this.instance) throw new Error('MSAL not initialized');

    try {
      const response = await this.instance.handleRedirectPromise();
      
      if (response?.account) {
        const user = this.mapAccountToUser(response.account);
        
        // Si el response incluye accessToken y es para nuestra API, usarlo directamente
        if (response.accessToken && this.isApiToken(response.accessToken)) {
          sessionStorage.setItem('azure-ad-token', response.accessToken);
          return { user, token: response.accessToken };
        }
        
        // Si no, obtener access token específico para la API del backend
        try {
          const apiTokenRequest = {
            ...apiRequest,
            account: response.account,
          };
          const apiResponse = await this.instance.acquireTokenSilent(apiTokenRequest);
          const token = apiResponse.accessToken;
          
          if (token) {
            sessionStorage.setItem('azure-ad-token', token);
            
            // Log para debugging
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              console.log('✅ Token de API obtenido en callback:', {
                aud: payload.aud,
                scp: payload.scp,
                expires: new Date(payload.exp * 1000).toLocaleString()
              });
            } catch (e) {
              console.log('✅ Token de API obtenido en callback');
            }
          }
          
          return { user, token };
        } catch (apiError) {
          console.warn('No se pudo obtener token de API:', apiError);
          return { user, token: null };
        }
      }
    } catch (error) {
      console.error('Error handling redirect response:', error);
    }

    return { user: null, token: null };
  }

  // Helper para verificar si el token es para nuestra API
  private static isApiToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Extraer el client ID del scope de la API: api://fc810a1e-f6b2-40b7-96a1-32abada72fd8/access_as_user
      const apiScope = process.env.NEXT_PUBLIC_AZURE_API_SCOPE;
      if (!apiScope) return false;
      
      const expectedClientId = apiScope.split('/')[2]; // fc810a1e-f6b2-40b7-96a1-32abada72fd8
      const expectedAud = `api://${expectedClientId}`;
      
      return payload.aud === expectedAud && payload.scp?.includes('access_as_user');
    } catch (_) {
      return false;
    }
  }

  static async getExistingUser(): Promise<{ user: AuthUser | null; token: string | null }> {
    if (!this.instance) throw new Error('MSAL not initialized');

    const accounts = this.instance.getAllAccounts();
    
    if (accounts.length > 0) {
      const user = this.mapAccountToUser(accounts[0]);
      
      // Primero verificar si ya tenemos un token válido en storage
      const storedToken = sessionStorage.getItem('azure-ad-token');
      if (storedToken && this.isTokenValid(storedToken)) {
        return { user, token: storedToken };
      }
      
      // Solo si no hay token válido, solicitar uno nuevo
      try {
        const apiTokenRequest = {
          ...apiRequest,
          account: accounts[0],
        };

        const response = await this.instance.acquireTokenSilent(apiTokenRequest);
        const token = response.accessToken;
        
        if (token) {
          sessionStorage.setItem('azure-ad-token', token);
          
          // Log para debugging - mostrar info del token
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log('🔐 Token de API obtenido:', {
              aud: payload.aud,
              scp: payload.scp,
              expires: new Date(payload.exp * 1000).toLocaleString(),
              userId: payload.oid || payload.sub
            });
          } catch (e) {
            console.log('✅ Token de API obtenido (no se pudo decodificar para debug)');
          }
        }
        
        return { user, token };
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          return { user: null, token: null };
        }
        return { user: null, token: null };
      }
    }

    return { user: null, token: null };
  }

  // Método helper para validar token
  private static isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return !!payload.exp && payload.exp > now + 300; // 5 min buffer
    } catch (_) {
      return false;
    }
  }

  static async login(): Promise<void> {
    if (!this.instance) throw new Error('MSAL not initialized');
    
    try {
      console.log('🚀 Iniciando login con scopes:', loginRequest.scopes);
      await this.instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    if (!this.instance) throw new Error('MSAL not initialized');

    // Limpiar tokens del almacenamiento - solo sessionStorage
    sessionStorage.removeItem('azure-ad-token');
    
    await this.instance.logoutRedirect({
      postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    });
  }

  /**
   * Limpia la sesión completamente para forzar nuevos scopes
   * Útil cuando cambias scopes en la configuración
   */
  static async clearSession(): Promise<void> {
    if (!this.instance) throw new Error('MSAL not initialized');

    // Limpiar todos los tokens almacenados - solo sessionStorage
    sessionStorage.clear();
    
    // Limpiar cache de MSAL
    await this.instance.clearCache();
    
    console.log('🧹 Sesión limpiada. Inicia sesión nuevamente para obtener nuevos scopes.');
  }

  static async refreshToken(): Promise<string | null> {
    if (!this.instance) throw new Error('MSAL not initialized');

    const accounts = this.instance.getAllAccounts();
    if (accounts.length === 0) return null;

    try {
      const apiTokenRequest = {
        ...apiRequest,
        account: accounts[0],
        forceRefresh: true,
      };
      
      const response = await this.instance.acquireTokenSilent(apiTokenRequest);
      
      const token = response.accessToken;
      if (token) {
        sessionStorage.setItem('azure-ad-token', token);
      }
      
      return token;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await this.login();
        return null;
      }
      await this.login();
      return null;
    }
  }

  private static mapAccountToUser(account: AccountInfo): AuthUser {
    return {
      id: account.localAccountId || account.homeAccountId,
      displayName: account.name || 'Usuario',
      email: account.username,
      isAuthenticated: true,
    };
  }
}
