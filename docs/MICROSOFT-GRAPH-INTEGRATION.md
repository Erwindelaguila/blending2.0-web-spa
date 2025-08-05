# 🚀 Autenticación Azure AD - Mejores Prácticas

Este proyecto implementa **autenticación Azure AD** siguiendo las **mejores prácticas oficiales de Microsoft**.

## 🎯 ¿Qué Hace el Frontend?

### ✅ **Frontend (Simple y Enfocado)**
```
Frontend → Azure AD → Obtiene JWT Token → Envía al Backend
```

### ✅ **Backend (Maneja Todo)**
```
Backend → Recibe Token → Valida con Azure AD → Consulta Microsoft Graph → Procesa Datos → Devuelve Menú
```

## 🔧 Configuración del Frontend

### 1. Scopes Minimalistas

En `src/config/auth.config.ts`:

```typescript
export const loginRequest = {
  scopes: [
    'openid', 
    'profile', 
    'User.Read',
    // ✅ Permite al backend usar Microsoft Graph en nombre del usuario
    'https://graph.microsoft.com/.default'
  ],
  prompt: 'select_account' as const,
};
```

### 2. AuthProvider Simplificado

El `AuthProvider` solo:
- ✅ Autentica con Azure AD
- ✅ Obtiene token JWT 
- ✅ Guarda token en sessionStorage
- ✅ Crea usuario básico (el backend enriquecerá los datos)

```typescript
// Usuario básico - El backend determinará roles, grupos y permisos
const authenticatedUser: IAuthenticatedUser = {
  profile: {
    displayName: account.name || 'Usuario',
    userPrincipalName: account.username,
    // ... datos básicos de MSAL
  },
  role: 'user', // El backend determinará el rol real
  groups: [], // El backend obtendrá grupos desde Microsoft Graph
  permissions: { dashboard: true, ... }, // Permisos mínimos
  isAuthenticated: true,
};
```

### 3. UserMenuService Simplificado

```typescript
export class UserMenuService {
  static async getUserMenu(): Promise<UserMenuResponse> {
    // ✅ SIMPLE: Solo envía token al backend
    const response = await api.get('/api/core/user/menu');
    return response.data;
  }
}
```

## � Lo que debe hacer tu Backend

### 1. Recibir y Validar Token

```csharp
[HttpGet("menu")]
public async Task<IActionResult> GetUserMenu()
{
    // 1. Extraer token del header Authorization
    var authHeader = Request.Headers["Authorization"].FirstOrDefault();
    var token = authHeader.Substring("Bearer ".Length).Trim();
    
    // 2. Validar token JWT contra Azure AD
    var userClaims = await ValidateAzureAdToken(token);
```

### 2. Usar Token para Microsoft Graph

```csharp
    // 3. Crear cliente Microsoft Graph con el token del usuario
    var graphClient = new GraphServiceClient(
        new DelegateAuthenticationProvider((requestMessage) =>
        {
            requestMessage.Headers.Authorization = 
                new AuthenticationHeaderValue("Bearer", token);
            return Task.FromResult(requestMessage);
        }));

    // 4. Obtener datos del usuario
    var user = await graphClient.Me
        .Request()
        .Select("id,displayName,userPrincipalName,mail")
        .GetAsync();

    // 5. Obtener grupos del usuario
    var memberOf = await graphClient.Me.MemberOf
        .Request()
        .Filter("@odata.type eq 'microsoft.graph.group'")
        .GetAsync();
```

### 3. Mapear Grupos a Roles

```csharp
    // 6. Mapear grupos Azure AD → roles aplicación
    var roleMapping = new Dictionary<string, string>
    {
        ["blending2.0-web-spa-Administradores"] = "admin",
        ["blending2.0-web-spa-Logistica"] = "logistics", 
        ["blending2.0-web-spa-Calidad"] = "quality"
    };

    var userRoles = userGroups
        .Where(g => roleMapping.ContainsKey(g.DisplayName))
        .Select(g => roleMapping[g.DisplayName])
        .ToList();
```

### 4. Filtrar Menú por Roles

```csharp
    // 7. Filtrar menú según roles del usuario
    var filteredMenu = FilterMenuByRoles(menuConfig, userRoles);

    // 8. Devolver respuesta completa
    return Ok(new {
        Success = true,
        Data = new {
            Menu = filteredMenu,
            UserInfo = new {
                Name = user.DisplayName,
                Email = user.UserPrincipalName,
                Roles = userRoles,
                Groups = userGroups.Select(g => g.DisplayName).ToList()
            }
        }
    });
```

## 🔐 Flujo de Autenticación Completo

### 1. Usuario hace Login
```
Usuario → Azure AD Login → Obtiene JWT Token
```

### 2. Frontend guarda Token
```typescript
sessionStorage.setItem('azure-ad-token', response.accessToken);
```

### 3. Frontend hace Request
```typescript
// El interceptor automáticamente incluye el token
const menu = await api.get('/api/core/user/menu');
// Header: Authorization: Bearer <jwt-token>
```

### 4. Backend procesa Token
```csharp
// Backend recibe token → Valida → Usa para Microsoft Graph → Devuelve datos
```

## 🛡️ Permisos Requeridos en Azure AD

### Application Permissions (No requeridos)
- El backend usa **Delegated Permissions** con el token del usuario

### Delegated Permissions (Requeridos)
- ✅ `User.Read` - Leer perfil del usuario
- ✅ `Directory.Read.All` - Leer grupos del directorio
- ✅ `GroupMember.Read.All` - Leer membresías de grupos

### Configuración en Azure AD
1. Ir a **App Registrations** → Tu App
2. **API Permissions** → Add Permission → Microsoft Graph
3. **Delegated Permissions** → Agregar los scopes mencionados
4. **Grant Admin Consent** si es necesario

## 🎯 Ventajas de este Enfoque

### ✅ **Mejores Prácticas**
- Frontend simple y enfocado en UI
- Backend maneja toda la lógica de negocio
- Una sola fuente de verdad para datos del usuario

### ✅ **Seguridad**
- Token solo se usa en el backend
- Validación centralizada
- Menos superficie de ataque

### ✅ **Performance**
- Una sola llamada a Microsoft Graph (en el backend)
- Datos consistentes entre frontend y backend
- Caching eficiente en el servidor

### ✅ **Mantenibilidad**
- Lógica de roles centralized
- Fácil testing del backend
- Frontend agnóstico a cambios de Azure AD

## 🔧 Debugging

### Frontend
```typescript
// Verificar token
console.log(sessionStorage.getItem('azure-ad-token'));

// Verificar usuario autenticado
const { user } = useAuth();
console.log(user);
```

### Backend Logs
```csharp
Console.WriteLine($"Usuario: {user.DisplayName}");
Console.WriteLine($"Grupos: {string.Join(", ", userGroups.Select(g => g.DisplayName))}");
Console.WriteLine($"Roles: {string.Join(", ", userRoles)}");
```

## � Notas Importantes

1. **Token Expiration**: El frontend maneja renovación automática via MSAL
2. **Error Handling**: Backend debe manejar errores de Microsoft Graph gracefully
3. **Fallbacks**: Siempre proveer menú básico si falla Microsoft Graph
4. **Logging**: Loggear accesos para auditoría y debugging
