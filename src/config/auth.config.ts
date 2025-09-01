import { LogLevel, Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,   // SPA
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI,
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_AZURE_POST_LOGOUT_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage",  // tokens en memoria de sesión (más seguro que localStorage)
    storeAuthStateInCookie: false,    // útil solo si debes soportar IE11
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Info,
      loggerCallback: (_, message, containsPii) => {
        if (!containsPii) console.log(message);
      },
    },
  },
};

// Scopes que tu SPA debe solicitar
export const loginRequest = {
  scopes: [
    process.env.NEXT_PUBLIC_AZURE_API_SCOPE!,   // scope expuesto en tu API (access_as_user)
    process.env.NEXT_PUBLIC_GRAPH_SCOPE!        // Microsoft Graph User.Read
  ]
};

// Request para obtener tokens específicamente para tu API
export const apiRequest = {
  scopes: [process.env.NEXT_PUBLIC_AZURE_API_SCOPE!], // api://fc810a1e-f6b2-40b7-96a1-32abada72fd8/access_as_user
};

// Request para Microsoft Graph
export const graphRequest = {
  scopes: [process.env.NEXT_PUBLIC_GRAPH_SCOPE!], // User.Read
};


