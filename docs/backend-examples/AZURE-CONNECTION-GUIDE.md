# 🔗 Configuración de Conexión a Azure App Configuration

## 📋 **Paso 1: Configurar Identidad en Azure**

### **Opción A: Managed Identity (Producción) 🛡️**
```bash
# 1. Habilitar System Managed Identity en tu App Service
az webapp identity assign --name "tu-app-service" --resource-group "tu-resource-group"

# 2. Dar permisos a la identidad en App Configuration
az role assignment create \
  --assignee $(az webapp identity show --name "tu-app-service" --resource-group "tu-resource-group" --query principalId -o tsv) \
  --role "App Configuration Data Reader" \
  --scope "/subscriptions/tu-subscription-id/resourceGroups/tu-resource-group/providers/Microsoft.AppConfiguration/configurationStores/tasaappconfig"
```

### **Opción B: Service Principal (Desarrollo) 🔧**
```bash
# 1. Crear Service Principal
az ad sp create-for-rbac --name "tasa-blending-sp" --role "App Configuration Data Reader" \
  --scopes "/subscriptions/tu-subscription-id/resourceGroups/tu-resource-group/providers/Microsoft.AppConfiguration/configurationStores/tasaappconfig"

# Esto te dará:
# - appId (Client ID)
# - password (Client Secret)  
# - tenant (Tenant ID)
```

## 📋 **Paso 2: Configurar appsettings.json**

### **Para Producción (Managed Identity):**
```json
{
  "AzureAppConfiguration": {
    "Endpoint": "https://tasaappconfig.azconfig.io"
  }
}
```

### **Para Desarrollo (Service Principal):**
```json
{
  "AzureAppConfiguration": {
    "Endpoint": "https://tasaappconfig.azconfig.io"
  },
  "AzureAd": {
    "TenantId": "tu-tenant-id",
    "ClientId": "tu-client-id",
    "ClientSecret": "tu-client-secret"
  }
}
```

## 📋 **Paso 3: Código de Conexión**

El backend se conecta automáticamente usando `DefaultAzureCredential`:

```csharp
// En Program.cs - esto es lo que hace la conexión
services.AddAzureAppConfiguration(options =>
{
    // DefaultAzureCredential busca credenciales en este orden:
    // 1. Variables de entorno
    // 2. Managed Identity (en Azure)
    // 3. Azure CLI (en desarrollo local)
    // 4. Visual Studio
    options.Connect(new Uri("https://tasaappconfig.azconfig.io"), new DefaultAzureCredential())
           .Select("App:Config:*", "production"); // Solo lee nuestras configuraciones
});
```

## 🔍 **Cómo DefaultAzureCredential Encuentra las Credenciales:**

### **En Producción (Azure App Service):**
1. ✅ Detecta automáticamente la Managed Identity
2. ✅ Usa esa identidad para conectarse
3. ✅ No necesita secretos en código

### **En Desarrollo Local:**
1. ✅ Busca variables de entorno `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`
2. ✅ O usa Azure CLI si está logueado: `az login`
3. ✅ O usa Visual Studio si está conectado

## ⚙️ **Variables de Entorno para Desarrollo:**
```bash
# En tu máquina local o en CI/CD
export AZURE_CLIENT_ID="tu-client-id"
export AZURE_CLIENT_SECRET="tu-client-secret"  
export AZURE_TENANT_ID="tu-tenant-id"
```

## 🚀 **Resultado:**
Tu backend se conecta automáticamente a Azure App Configuration y puede leer las 3 configuraciones que creaste:
- `App:Config:AzureGroupMapping`
- `App:Config:RoleDefinitions`  
- `App:Config:Menu`
