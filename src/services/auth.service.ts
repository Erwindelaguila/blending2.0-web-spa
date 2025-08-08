import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '@/config/auth.config';
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
        const token = response.accessToken;
        const user = this.mapAccountToUser(response.account);
        
        if (token) {
          sessionStorage.setItem('azure-ad-token', token);
        }
        
        return { user, token };
      }
    } catch (error) {
      console.error('Error handling redirect response:', error);
    }

    return { user: null, token: null };
  }

  static async getExistingUser(): Promise<{ user: AuthUser | null; token: string | null }> {
    if (!this.instance) throw new Error('MSAL not initialized');

    const accounts = this.instance.getAllAccounts();
    
    if (accounts.length > 0) {
      try {
        const silentRequest = {
          scopes: loginRequest.scopes,
          account: accounts[0],
        };

        const response = await this.instance.acquireTokenSilent(silentRequest);
        const user = this.mapAccountToUser(accounts[0]);
        
        if (response.accessToken) {
          sessionStorage.setItem('azure-ad-token', response.accessToken);
        }
        
        return { user, token: response.accessToken };
      } catch (error) {
        return { user: null, token: null };
      }
    }

    return { user: null, token: null };
  }

  static async login(): Promise<void> {
    if (!this.instance) throw new Error('MSAL not initialized');
    
    try {
      await this.instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    if (!this.instance) throw new Error('MSAL not initialized');

    sessionStorage.removeItem('azure-ad-token');
    localStorage.removeItem('azure-ad-token');
    
    await this.instance.logoutRedirect({
      postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    });
  }

  static async refreshToken(): Promise<string | null> {
    if (!this.instance) throw new Error('MSAL not initialized');

    const accounts = this.instance.getAllAccounts();
    if (accounts.length === 0) return null;

    try {
      const silentRequest = {
        scopes: loginRequest.scopes,
        account: accounts[0],
        forceRefresh: true,
      };
      
      const response = await this.instance.acquireTokenSilent(silentRequest);
      
      if (response.accessToken) {
        sessionStorage.setItem('azure-ad-token', response.accessToken);
      }
      
      return response.accessToken;
    } catch (error) {
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
