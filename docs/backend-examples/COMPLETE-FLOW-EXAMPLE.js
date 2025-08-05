/**
 * 🔄 FLUJO COMPLETO: Usuario hace login y obtiene menú personalizado
 */

// 1️⃣ USUARIO SE LOGUEA (Frontend)
const loginUser = async () => {
  // Usuario se autentica con Azure AD
  const response = await msalInstance.loginPopup({
    scopes: ["User.Read", "https://tu-backend-url/.default"]
  });
  
  // Frontend guarda el token
  const token = response.accessToken;
  sessionStorage.setItem('azure-ad-token', token);
};

// 2️⃣ FRONTEND PIDE MENÚ AL BACKEND
const getUserMenu = async () => {
  const token = sessionStorage.getItem('azure-ad-token');
  
  // Frontend envía token al backend
  const response = await fetch('/api/user/menu', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const menuData = await response.json();
  return menuData;
};

// 3️⃣ BACKEND RECIBE REQUEST Y PROCESA
/*
[HttpGet("menu")]
public async Task<IActionResult> GetUserMenu()
{
    // A. Backend valida el token Azure AD
    var userClaims = ExtractUserClaims(); // Obtiene grupos del usuario
    
    // B. Backend consulta Azure App Configuration
    var groupMapping = await _appConfigService.GetAzureGroupMappingAsync();
    // 🌐 AQUÍ SE CONECTA A AZURE APP CONFIG
    // Lee: App:Config:AzureGroupMapping desde la nube
    
    var roleDefinitions = await _appConfigService.GetRoleDefinitionsAsync();
    // 🌐 AQUÍ SE CONECTA A AZURE APP CONFIG  
    // Lee: App:Config:RoleDefinitions desde la nube
    
    var menuConfig = await _appConfigService.GetMenuConfigurationAsync();
    // 🌐 AQUÍ SE CONECTA A AZURE APP CONFIG
    // Lee: App:Config:Menu desde la nube
    
    // C. Backend mapea grupos → roles
    var userRoles = MapGroupsToRoles(userClaims.Groups, groupMapping);
    
    // D. Backend filtra menú según roles
    var filteredMenu = FilterMenuByRoles(menuConfig.MainNavigation, userRoles);
    
    // E. Backend devuelve menú personalizado
    return Ok(new {
        Success = true,
        Data = new {
            Menu = filteredMenu,      // ✅ Menú filtrado según rol
            UserInfo = userInfo       // ✅ Info del usuario
        }
    });
}
*/

// 4️⃣ FRONTEND RECIBE MENÚ Y LO MUESTRA
const displayUserMenu = async () => {
  try {
    const menuData = await getUserMenu();
    
    if (menuData.Success) {
      const { Menu, UserInfo } = menuData.Data;
      
      // Frontend renderiza menú personalizado
      setUserMenu(Menu);           // ✅ Solo ve sus módulos
      setUserInfo(UserInfo);       // ✅ Info del usuario
      
      console.log('Roles del usuario:', UserInfo.Roles);
      console.log('Menú personalizado:', Menu);
    }
  } catch (error) {
    console.error('Error obteniendo menú:', error);
  }
};

/**
 * 📊 EJEMPLO DE RESPUESTA DEL BACKEND:
 */
const exampleResponse = {
  "Success": true,
  "Data": {
    "Menu": [
      {
        "id": "dashboard",
        "label": "Dashboard", 
        "path": "/dashboard",
        "icon": "Home",
        "required_roles": ["calidad"],
        "order": 1
      },
      {
        "id": "modelos",
        "label": "Modelos",
        "icon": "ModelingView", 
        "required_roles": ["calidad"],
        "order": 2,
        "children": [
          {
            "id": "modelos-harina",
            "label": "Harina",
            "path": "/modelos/harina", 
            "icon": "Agriculture",
            "required_roles": ["calidad"]
          }
          // ❌ NO incluye "Contenedores" porque usuario no es "logistica"
        ]
      }
      // ❌ NO incluye "Mantenimientos" porque usuario no es "administrador"
    ],
    "UserInfo": {
      "Id": "user-object-id",
      "Name": "Juan Pérez",
      "Email": "juan.perez@tasa.com.pe", 
      "Roles": ["calidad"],           // ✅ Solo rol "calidad"
      "RoleDefinitions": [
        {
          "id": "calidad",
          "name": "Calidad",
          "displayName": "Área de Calidad",
          "allowedModules": ["calidad"]
        }
      ]
    }
  },
  "Message": "Menú de usuario obtenido exitosamente"
};

export { loginUser, getUserMenu, displayUserMenu };
