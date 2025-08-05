import { useState, useEffect, useCallback } from 'react';
import { UserMenuService, type UserMenuResponse, type MenuItem, type UserInfo } from '@/services/user-menu.service';
import { useAuth } from '@/providers/auth-provider';

export interface UseUserMenuReturn {
  menu: MenuItem[];
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  refreshMenu: () => Promise<void>;
}

/**
 * Hook para manejar el menú dinámico del usuario
 * ✅ CORRECTO: Solo obtiene datos desde el backend
 * ❌ NO deserializa tokens - eso lo hace el backend
 */
export const useUserMenu = (): UseUserMenuReturn => {
  console.log('🚀🚀🚀 HOOK INICIADO - useUserMenu v3.0 FINAL FIX - TIMESTAMP:', new Date().toISOString());
  const { user } = useAuth(); // Cambié isAuthenticated por user
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user; // Derivamos isAuthenticated de user

  // Cargar desde localStorage
  const loadFromStorage = useCallback(() => {
    try {
      const storedMenu = localStorage.getItem('userMenu');
      const storedUserInfo = localStorage.getItem('userInfo');
      
      if (storedMenu) {
        setMenu(JSON.parse(storedMenu));
      }
      
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (err) {
      console.error('Error al cargar desde localStorage:', err);
    }
  }, []);

  const fetchUserMenu = useCallback(async () => {
    try {
      console.log('🔵 Iniciando fetchUserMenu...');
      setIsLoading(true);
      setError(null);
      
      const response = await UserMenuService.getUserMenu();
      console.log('📊 Respuesta COMPLETA del backend en HOOK:', {
        success: response.success,              
        succeeded: response.succeeded,          
        message: response.message,              
        data: response.data,                    
        menuLength: response.data?.menu?.length,        
        userInfo: response.data?.userInfo               
      });
      
      // 🔍 EXTRA DEBUG: Verificar todas las propiedades de la respuesta
      console.log('🔍 RESPONSE KEYS EN HOOK:', Object.keys(response));
      console.log('🔍 RESPONSE TYPE EN HOOK:', typeof response);
      console.log('🔍 RESPONSE COMPLETO EN HOOK:', response);
      
      // ✅ SIMPLIFICADO: Si hay datos válidos, procesar
      if (response.data?.menu && Array.isArray(response.data.menu) && response.data.menu.length > 0) {
        console.log('✅ Menú obtenido exitosamente en HOOK:', {
          menuItems: response.data.menu.length,          
          userInfo: response.data.userInfo                
        });
        
        // FORZAR LIMPIEZA DE ERRORES PRIMERO
        setError(null);
        
        // ACTUALIZAR ESTADOS
        setMenu(response.data.menu);                      
        setUserInfo(response.data.userInfo || null);              
        
        // GUARDAR EN LOCALSTORAGE
        localStorage.setItem('userMenu', JSON.stringify(response.data.menu));      
        localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo || {}));  
        
        console.log('✅ HOOK: Estado actualizado correctamente - menú tiene', response.data.menu.length, 'elementos');
        console.log('✅ HOOK: Menu items:', response.data.menu.map(item => ({ id: item.id, label: item.label })));
        
      } else {
        // ⚠️ FALLBACK: Si el servicio funciona pero no hay menú, usar menú por defecto
        console.warn('⚠️ RESPUESTA VÁLIDA PERO SIN MENÚ - usando fallback');
        
        const fallbackMenu = [
          {
            id: "dashboard",
            label: "Dashboard", 
            href: "/dashboard",
            iconName: "Home",
            items: []
          }
        ];
        
        setMenu(fallbackMenu);
        setUserInfo(response.data?.userInfo || null);
        setError(null);
        
        console.log('🔍 DEBUG DETALLADO - Por qué no hay menú:', {
          hasData: !!response.data,
          hasMenu: !!response.data?.menu,
          menuIsArray: Array.isArray(response.data?.menu),
          menuLength: response.data?.menu?.length,
          menuContent: response.data?.menu,
          fullResponseData: response.data
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el menú del usuario';
      console.error('❌ Error al obtener el menú del usuario:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(errorMessage);
      setMenu([]);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para refrescar el menú
  const refreshMenu = useCallback(async () => {
    if (isAuthenticated) {
      await fetchUserMenu();
    }
  }, [isAuthenticated, fetchUserMenu]);

  // Efecto para cargar el menú cuando el usuario se autentica
  useEffect(() => {
    console.log('🔵 useUserMenu effect triggered:', { 
      isAuthenticated,
      userExists: !!user,
      userEmail: user?.profile?.userPrincipalName 
    });
    
    if (isAuthenticated) {
      console.log('✅ Usuario autenticado, cargando menú...');
      loadFromStorage();
      fetchUserMenu();
    } else {
      console.log('⚠️ Usuario no autenticado, limpiando estado...');
      // Limpiar estado cuando no está autenticado
      setMenu([]);
      setUserInfo(null);
      localStorage.removeItem('userMenu');
      localStorage.removeItem('userInfo');
    }
  }, [isAuthenticated, loadFromStorage, fetchUserMenu]);

  return {
    menu,
    userInfo,
    isLoading,
    error,
    refreshMenu
  };
};
