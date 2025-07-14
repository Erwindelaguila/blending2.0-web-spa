import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || ''}`,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI || '',
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_AZURE_POST_LOGOUT_REDIRECT_URI || '',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error('MSAL Error:', message);
            return;
          case LogLevel.Info:
            console.info('MSAL Info:', message);
            return;
          case LogLevel.Verbose:
            console.debug('MSAL Verbose:', message);
            return;
          case LogLevel.Warning:
            console.warn('MSAL Warning:', message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
  prompt: 'select_account' as const,
};

export const roleConfig = {
  groups: {
    'blending2.0-web-spa-Administradores': 'admin',
    'blending2.0-web-spa-Logistica': 'logistics',
    'blending2.0-web-spa-Calidad': 'quality',
  },
  defaultRole: 'user',
} as const;

export type UserRole = 'admin' | 'logistics' | 'quality' | 'user';

export const groupModuleAccess = {
  'blending2.0-web-spa-Administradores': ['administrador'],
  'blending2.0-web-spa-Logistica': ['logistica'],
  'blending2.0-web-spa-Calidad': ['calidad'],
} as const;

export function getUserModuleAccessByEmail(email: string): string[] {
  if (email.includes('admin') || email.includes('administrador')) {
    return ['administrador', 'logistica', 'calidad'];
  }
  if (email.includes('logistica')) {
    return ['logistica'];
  }
  if (email.includes('calidad')) {
    return ['calidad'];
  }
  return ['logistica'];
}

export function getUserModuleAccess(groups: Array<{displayName: string}>): string[] {
  const accessibleModules = new Set<string>();
  groups.forEach(group => {
    const modules = groupModuleAccess[group.displayName as keyof typeof groupModuleAccess];
    if (modules) {
      modules.forEach(module => accessibleModules.add(module));
    }
  });
  return Array.from(accessibleModules);
}

export const modulePermissions = {
  admin: {
    configuraciones: true,
    consultas: true,
    mantenimientos: true,
    modelos: true,
    dashboard: true,
  },
  logistics: {
    configuraciones: false,
    consultas: true,
    mantenimientos: false,
    modelos: true,
    dashboard: true,
  },
  quality: {
    configuraciones: false,
    consultas: true,
    mantenimientos: false,
    modelos: true,
    dashboard: true,
  },
  user: {
    configuraciones: false,
    consultas: false,
    mantenimientos: false,
    modelos: false,
    dashboard: true,
  },
} as const;
