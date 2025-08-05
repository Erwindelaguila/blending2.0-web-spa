/**
 * 🎯 BACKEND RECOMENDADO - Maneja toda la lógica de Microsoft Graph
 */

// ============================================================================
// 1. RECIBE TOKEN DEL FRONTEND
// ============================================================================
[HttpGet("menu")]
public async Task<IActionResult> GetUserMenu()
{
    try 
    {
        // Extraer token del header Authorization
        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized("Token no proporcionado");
        }
        
        var token = authHeader.Substring("Bearer ".Length).Trim();
        
        // ✅ BACKEND valida el token JWT
        var userClaims = await ValidateAzureAdToken(token);
        if (userClaims == null)
        {
            return Unauthorized("Token inválido");
        }

        // ============================================================================
        // 2. BACKEND CONSULTA MICROSOFT GRAPH (NO EL FRONTEND)
        // ============================================================================
        
        // Crear cliente de Microsoft Graph con el token del usuario
        var graphClient = new GraphServiceClient(
            new DelegateAuthenticationProvider((requestMessage) =>
            {
                requestMessage.Headers.Authorization = 
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                return Task.FromResult(requestMessage);
            }));

        // Obtener información del usuario desde Microsoft Graph
        var user = await graphClient.Me
            .Request()
            .Select("id,displayName,userPrincipalName,mail")
            .GetAsync();

        // Obtener grupos del usuario desde Microsoft Graph
        var memberOf = await graphClient.Me.MemberOf
            .Request()
            .Filter("@odata.type eq 'microsoft.graph.group'")
            .GetAsync();

        var userGroups = memberOf.CurrentPage
            .OfType<Group>()
            .Select(g => new { g.Id, g.DisplayName })
            .ToList();

        Console.WriteLine($"✅ Usuario: {user.DisplayName}");
        Console.WriteLine($"✅ Grupos encontrados: {userGroups.Count}");
        foreach (var group in userGroups)
        {
            Console.WriteLine($"   - {group.DisplayName} ({group.Id})");
        }

        // ============================================================================
        // 3. BACKEND MAPEA GRUPOS → ROLES
        // ============================================================================
        
        var roleMapping = await GetRoleMappingFromConfig(); // Desde Azure App Config
        var userRoles = new List<string>();

        foreach (var group in userGroups)
        {
            if (roleMapping.ContainsKey(group.DisplayName))
            {
                userRoles.Add(roleMapping[group.DisplayName]);
            }
        }

        // Rol por defecto si no tiene ninguno
        if (!userRoles.Any())
        {
            userRoles.Add("user");
        }

        Console.WriteLine($"✅ Roles mapeados: {string.Join(", ", userRoles)}");

        // ============================================================================
        // 4. BACKEND FILTRA MENÚ SEGÚN ROLES
        // ============================================================================
        
        var menuConfig = await GetMenuConfigurationFromConfig(); // Desde Azure App Config
        var filteredMenu = FilterMenuByRoles(menuConfig, userRoles);

        Console.WriteLine($"✅ Elementos del menú filtrados: {filteredMenu.Count}");

        // ============================================================================
        // 5. BACKEND DEVUELVE RESPUESTA COMPLETA
        // ============================================================================
        
        var response = new
        {
            Success = true,
            Data = new
            {
                Menu = filteredMenu,
                UserInfo = new
                {
                    Name = user.DisplayName,
                    Email = user.UserPrincipalName,
                    Roles = userRoles,
                    Groups = userGroups.Select(g => g.DisplayName).ToList()
                }
            },
            Message = "Menú obtenido exitosamente"
        };

        return Ok(response);
    }
    catch (ServiceException ex) when (ex.Error.Code == "Forbidden")
    {
        Console.WriteLine("❌ Sin permisos para Microsoft Graph");
        return StatusCode(403, "Sin permisos para acceder a Microsoft Graph");
    }
    catch (ServiceException ex)
    {
        Console.WriteLine($"❌ Error de Microsoft Graph: {ex.Error.Code} - {ex.Error.Message}");
        return StatusCode(500, "Error consultando Microsoft Graph");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error general: {ex.Message}");
        return StatusCode(500, "Error interno del servidor");
    }
}

// ============================================================================
// MÉTODOS AUXILIARES
// ============================================================================

private async Task<Dictionary<string, string>> GetRoleMappingFromConfig()
{
    // Consultar Azure App Configuration
    return new Dictionary<string, string>
    {
        ["blending2.0-web-spa-Administradores"] = "admin",
        ["blending2.0-web-spa-Logistica"] = "logistics", 
        ["blending2.0-web-spa-Calidad"] = "quality"
    };
}

private async Task<List<MenuItem>> GetMenuConfigurationFromConfig()
{
    // Consultar Azure App Configuration para obtener estructura del menú
    return new List<MenuItem>
    {
        new MenuItem { Id = "dashboard", Label = "Dashboard", Href = "/dashboard" },
        new MenuItem { Id = "admin", Label = "Administración", RequiredRoles = new[] { "admin" } },
        // ... más elementos
    };
}

private List<MenuItem> FilterMenuByRoles(List<MenuItem> menu, List<string> userRoles)
{
    return menu.Where(item => 
        item.RequiredRoles == null || 
        item.RequiredRoles.Any(role => userRoles.Contains(role))
    ).ToList();
}

private async Task<ClaimsPrincipal> ValidateAzureAdToken(string token)
{
    // Validar token JWT contra Azure AD
    // Devolver claims del usuario si es válido
    // Retornar null si es inválido
}
