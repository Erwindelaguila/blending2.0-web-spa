import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../constants/env";

// ============================================================================
// CONFIGURACIÓN DEL CLIENTE API
// ============================================================================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// INTERCEPTOR PARA REQUESTS - INCLUIR TOKEN DE AZURE AD
// ============================================================================
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Obtener el token de Azure AD desde el sessionStorage/localStorage
      const token = await getAzureAdToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        
        // 🔍 DEBUG: Log del token para debugging
        console.log('🔐 Token enviado al backend:');
        console.log('- Longitud:', token.length);
        console.log('- Primeros 50 caracteres:', token.substring(0, 50) + '...');
        console.log('- Headers Authorization:', config.headers.Authorization?.substring(0, 70) + '...');
        
        // Verificar si el token es válido
        if (isTokenValid(token)) {
          console.log('✅ Token válido según frontend');
        } else {
          console.warn('⚠️ Token inválido según frontend');
        }
      } else {
        console.warn('❌ No se encontró token de Azure AD');
      }
      
      // Agregar headers adicionales para el backend
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['X-Client-Version'] = '2.0';
      config.headers['Content-Type'] = 'application/json';
      
    } catch (error) {
      console.warn('No se pudo obtener el token de Azure AD:', error);
      // Continuar sin token - el backend manejará la respuesta 401
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Obtiene el token de Azure AD del almacenamiento o MSAL
 * Implementación mejorada que verifica múltiples fuentes
 */
async function getAzureAdToken(): Promise<string | null> {
  try {
    // 1. Intentar obtener desde sessionStorage (más seguro y actualizado)
    let token = sessionStorage.getItem('azure-ad-token');
    if (token && isTokenValid(token)) {
      return token;
    }

    // 2. Fallback: obtener desde localStorage
    token = localStorage.getItem('azure-ad-token');
    if (token && isTokenValid(token)) {
      return token;
    }

    // 3. Si no hay token válido, el sistema debe redirigir al login
    console.warn('No se encontró token válido de Azure AD');
    return null;
  } catch (error) {
    console.error('Error obteniendo token de Azure AD:', error);
    return null;
  }
}

/**
 * Verifica si un token JWT es válido (no expirado)
 */
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const isValid = payload.exp && payload.exp > currentTime;
    
    // 🔍 DEBUG: Información detallada del token
    console.log('🔍 Análisis del token JWT:');
    console.log('- Emisor (iss):', payload.iss);
    console.log('- Audiencia (aud):', payload.aud);
    console.log('- Expira en:', new Date(payload.exp * 1000).toLocaleString());
    console.log('- Emitido en:', new Date(payload.iat * 1000).toLocaleString());
    console.log('- Usuario (sub):', payload.sub);
    console.log('- Tiempo actual:', new Date().toLocaleString());
    console.log('- Token válido:', isValid);
    
    return isValid;
  } catch (error) {
    console.error('❌ Error al parsear token JWT:', error);
    return false;
  }
}

// ============================================================================
// INTERCEPTOR PARA RESPONSES - MANEJO DE ERRORES
// ============================================================================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token de Azure AD
        const newToken = await refreshAzureAdToken();
        
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refrescando token:', refreshError);
        // Redirigir al login si no se puede refrescar
        window.location.href = '/login';
      }
    }

    // Log de errores para debugging
    if (error.response?.status === 403) {
      console.warn('Acceso denegado - verificar permisos:', error.response.data);
    }

    return Promise.reject(error);
  }
);

/**
 * Intenta refrescar el token de Azure AD
 * Esta función se puede mejorar integrándose con MSAL
 */
async function refreshAzureAdToken(): Promise<string | null> {
  try {
    // Aquí implementarías la lógica de refresh con MSAL
    // Por ahora, retorna null para forzar re-login
    console.log('Token refresh requerido - implementar con MSAL');
    return null;
  } catch (error) {
    console.error('Error en refresh de token:', error);
    return null;
  }
}

export default api;
