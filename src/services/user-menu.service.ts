import api from "@/lib/api/client";

// Interfaces para el menú dinámico - ACTUALIZADAS para el sidebar
export interface MenuItem {
  id: string;
  label: string;
  href?: string; // Cambié de 'path' a 'href' para coincidir con sidebar
  iconName?: string; // Cambié de 'icon' a 'iconName' para el mapeo
  items?: MenuItem[]; // Cambié de 'children' a 'items' para coincidir con sidebar
}

export interface UserInfo {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  roles: string[];
  roleDefinitions?: any[]; // Información de definiciones de roles desde el backend
  groups?: string[]; // Información de grupos desde el backend (opcional)
  
  // BACKWARD COMPATIBILITY: Mantener campos con mayúscula para componentes que los usen
  Name?: string; 
  Email?: string;
  Roles?: string[];
  Groups?: string[];
}

export interface UserMenuResponse {
  success?: boolean;       // ✅ OPCIONAL: Puede estar en el nivel raíz
  succeeded?: boolean;     // ✅ OPCIONAL: O puede llamarse "succeeded"  
  message?: string;        // ✅ OPCIONAL: Mensaje en el nivel raíz
  errors?: any;
  data: {                  // ✅ REQUERIDO: Los datos siempre están aquí
    menu: MenuItem[];      // ✅ CORREGIDO: 'm' minúscula
    userInfo: UserInfo;    // ✅ CORREGIDO: camelCase
    success?: boolean;     // ✅ OPCIONAL: Puede estar dentro de data también
    message?: string;      // ✅ OPCIONAL: Mensaje puede estar dentro de data
  };
  statusCode?: number;     // ✅ OPCIONAL: StatusCode
}

export class UserMenuService {
  /**
   * ✅ MEJORES PRÁCTICAS: Solo envía token al backend
   * El backend maneja Microsoft Graph, mapeo de roles y filtrado de menú
   */
  static async getUserMenu(): Promise<UserMenuResponse> {
    try {
      console.log('🔵 Obteniendo menú del usuario desde backend...');

      // ✅ SIMPLE: Solo enviar token JWT al backend
      // El interceptor de Axios automáticamente incluye el token en Authorization header
      const response = await api.get<UserMenuResponse>(
        "http://localhost:7071/api/core/user/menu"
      );

      console.log('✅ Respuesta CRUDA del backend:', response);
      
      // 🔍 DEBUG: Mostrar estructura completa
      console.log('📊 Estructura de response:', {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      const result = response.data as UserMenuResponse;
      console.log('📊 Menú procesado:', result);

      // --- TRANSFORMACIÓN DE MENÚ DEL BACKEND AL FRONTEND ---
      // Función de transformación para convertir del formato backend al frontend
      const transformMenuItem = (backendItem: any): MenuItem => {
        return {
          id: backendItem.id,
          label: backendItem.label,
          href: backendItem.path,           // ✅ MAPEO: path → href
          iconName: backendItem.icon,       // ✅ MAPEO: icon → iconName
          items: backendItem.children?.map(transformMenuItem) || [] // ✅ MAPEO: children → items (recursivo)
        };
      };

      // Si hay menú, transformarlo
      if (result.data && result.data.menu && result.data.menu.length > 0) {
        const transformedMenu = result.data.menu.map(transformMenuItem);
        console.log('🔄 Menú transformado para frontend:', transformedMenu);
        result.data.menu = transformedMenu;
      }

      // ✅ NORMALIZAR USERINFO PARA COMPATIBILIDAD
      if (result.data && result.data.userInfo) {
        const userInfo = result.data.userInfo;
        // Asegurar que tenga todos los campos esperados
        result.data.userInfo = {
          ...userInfo,
          // Campos principales (formato backend)
          id: userInfo.id || (userInfo as any).Id || 'unknown',
          name: userInfo.name || (userInfo as any).Name || (userInfo as any).givenName || 'Usuario',
          lastName: userInfo.lastName || (userInfo as any).LastName || (userInfo as any).surname || '',
          email: userInfo.email || (userInfo as any).Email || (userInfo as any).userPrincipalName || '',
          roles: userInfo.roles || (userInfo as any).Roles || [],
          roleDefinitions: userInfo.roleDefinitions || (userInfo as any).RoleDefinitions || [],
          groups: userInfo.groups || (userInfo as any).Groups || [],
          
          // BACKWARD COMPATIBILITY: Campos con mayúscula 
          Name: userInfo.name || (userInfo as any).Name || (userInfo as any).givenName || 'Usuario',
          Email: userInfo.email || (userInfo as any).Email || (userInfo as any).userPrincipalName || '',
          Roles: userInfo.roles || (userInfo as any).Roles || [],
          Groups: userInfo.groups || (userInfo as any).Groups || []
        };
        console.log('✅ UserInfo normalizado:', result.data.userInfo);
      }

      // 🔍 SUPER DEBUG: Ver la estructura COMPLETA del response
      console.log('🔍 Keys del response.data COMPLETO:', Object.keys(result));
      console.log('🔍 response.data COMPLETO:', result);
      // 🔍 EXTRA DEBUG: Verificar estructura del campo data
      console.log('🔍 Estructura de result.data:', result.data);
      console.log('🔍 Tipo de result.data:', typeof result.data);
      console.log('🔍 Keys de result.data:', result.data ? Object.keys(result.data) : 'No data');
      
      // 🔍 EXTRA DEBUG: Verificar el valor de succeeded/success EN TODOS LOS NIVELES
      console.log('🔍 result.succeeded (raíz):', result.succeeded);    
      console.log('🔍 result.success (raíz):', result.success);    
      console.log('🔍 result.data.success (dentro de data):', result.data.success);
      console.log('🔍 result.data.message (dentro de data):', result.data.message);
      
      // ✅ PRIORIZAR 'succeeded' porque es lo que envía el backend
      const isSuccess = result.succeeded || result.success || result.data.success || 
                       (result.data.menu && result.data.menu.length > 0); // Si hay menú, asumimos éxito
      console.log('🔍 DETECCIÓN DE ÉXITO EN SERVICE:', {
        'result.succeeded': result.succeeded,
        'result.success': result.success,
        'result.data.success': result.data.success, 
        'menuLength': result.data.menu?.length,
        'isSuccess': isSuccess
      });

      // ✅ ASEGURAR QUE LA RESPUESTA SIEMPRE TENGA EL CAMPO SUCCESS CORRECTO
      const finalResponse = {
        ...result,
        success: isSuccess,  // Garantizar que success esté en true si hay éxito
        succeeded: isSuccess // Mantener ambos campos para compatibilidad
      };

      console.log('🔍 RESPUESTA FINAL DEL SERVICE:', finalResponse);
      return finalResponse;

    } catch (error) {
      console.error('❌ Error completo obteniendo menú del usuario:', {
        error,
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      
      // ✅ MEJORES PRÁCTICAS: Fallback graceful
      const fallbackResponse: UserMenuResponse = {
        success: false,      // ✅ CORREGIDO: usar "success"
        message: error instanceof Error ? error.message : "Error al cargar el menú del usuario", // ✅ CORREGIDO: usar "message"
        errors: error,
        data: {             // ✅ CORREGIDO: usar "data"
          menu: [           // ✅ CORREGIDO: usar "menu" minúscula
            {
              id: "dashboard",
              label: "Dashboard",
              href: "/dashboard",
              iconName: "Home"
            }
          ],
          userInfo: {       // ✅ CORREGIDO: usar "userInfo" camelCase
            id: "fallback-user",
            name: "Usuario",
            email: "usuario@local",
            roles: ["usuario"],
            groups: [],
            // BACKWARD COMPATIBILITY
            Name: "Usuario",
            Email: "usuario@local", 
            Roles: ["usuario"],
            Groups: []
          }
        },
        statusCode: 500     // ✅ AGREGADO: statusCode de error
      };

      // En caso de error, devolvemos la respuesta de fallback
      return fallbackResponse;
    }
  }
}
