import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || ''}`,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI || '',
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_AZURE_POST_LOGOUT_REDIRECT_URI || '',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(`MSAL ${LogLevel[level]}:`, message);
      },
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: [
    'openid',
    'profile',
    // Incluir el scope de tu API directamente en el login
    process.env.NEXT_PUBLIC_AZURE_BACKEND_CLIENT_ID 
      ? `api://${process.env.NEXT_PUBLIC_AZURE_BACKEND_CLIENT_ID}/access_as_user`
      : `api://${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}/access_as_user`
  ],
  prompt: 'select_account' as const,
};

export const apiRequest = {
  scopes: [
    // Si tienes el backend client ID como variable de entorno
    process.env.NEXT_PUBLIC_AZURE_BACKEND_CLIENT_ID 
      ? `api://${process.env.NEXT_PUBLIC_AZURE_BACKEND_CLIENT_ID}/access_as_user`
      // Fallback: usa el mismo client ID si no tienes backend separado
      : `api://${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}/access_as_user`
  ],
};


