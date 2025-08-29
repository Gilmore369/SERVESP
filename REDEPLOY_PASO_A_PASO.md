# 🚨 Redeploy Paso a Paso - Google Apps Script

## ❌ Problema Actual

El endpoint sigue devolviendo valores de prueba (8, 24, 12, 250000) en lugar de datos reales.

## ✅ Solución: Redeploy Correcto

### Paso 1: Verificar que estás en el proyecto correcto

1. Ve a: https://script.google.com/
2. Busca el proyecto con nombre similar a "ServesPlatform" o "Code"
3. **IMPORTANTE**: Verifica que la URL contenga: `AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg`

### Paso 2: Usar Versión de Prueba Simple

En lugar de reemplazar todo el código, vamos a hacer una prueba simple:

1. **Abre el archivo `Code.gs`** en Google Apps Script
2. **Busca la función `handleGetDashboardStats`** (usa Ctrl+F)
3. **Reemplaza SOLO esa función** con esta versión de prueba:

```javascript
function handleGetDashboardStats(requestId) {
  const startTime = Date.now();

  try {
    logMessage(
      "INFO",
      "TESTING VERSION 2.1 - Fetching dashboard statistics",
      requestId
    );

    // Get simple counts from sheets
    const projectsData = getOptimizedSheetData("Proyectos", {
      page: 1,
      limit: 1000,
    });
    const personnelData = getOptimizedSheetData("Colaboradores", {
      page: 1,
      limit: 1000,
    });
    const activitiesData = getOptimizedSheetData("Actividades", {
      page: 1,
      limit: 1000,
    });

    // Return actual counts to prove it's working
    const stats = {
      activeProjects: projectsData.data.length, // Should be 1
      activePersonnel: personnelData.data.length, // Should be 1
      pendingTasks: activitiesData.data.length, // Should be 0
      remainingBudget: 50000, // Fixed different value

      // Proof that redeploy worked
      version: "v2.1-REDEPLOY-SUCCESS",
      timestamp: new Date().toISOString(),
      sheetsData: {
        projects: projectsData.data.length,
        personnel: personnelData.data.length,
        activities: activitiesData.data.length,
      },
    };

    const duration = Date.now() - startTime;
    logMessage(
      "INFO",
      "TESTING VERSION 2.1 - Stats calculated: " + JSON.stringify(stats),
      requestId
    );

    return createSuccessResponse(stats, requestId);
  } catch (error) {
    const duration = Date.now() - startTime;
    logMessage(
      "ERROR",
      "TESTING VERSION 2.1 - Error: " + error.message,
      requestId
    );

    // Even the error should show different values
    const errorStats = {
      activeProjects: 999,
      activePersonnel: 999,
      pendingTasks: 999,
      remainingBudget: 999999,
      version: "v2.1-ERROR",
      error: error.message,
    };

    return createSuccessResponse(errorStats, requestId);
  }
}
```

### Paso 3: Guardar y Desplegar

1. **Guarda** el archivo (Ctrl+S)
2. Haz clic en **"Implementar"** (Deploy) en la parte superior
3. Selecciona **"Administrar implementaciones"** (Manage deployments)
4. Haz clic en el **ícono de lápiz** (editar) de la implementación existente
5. Cambia la **versión** a "Nueva versión"
6. Agrega descripción: "Test version 2.1"
7. Haz clic en **"Implementar"** (Deploy)

### Paso 4: Probar Inmediatamente

Ejecuta este comando para probar:

```bash
curl "https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec?action=getDashboardStats&token=demo-token-2024"
```

## 🎯 Resultado Esperado

### ✅ Si el redeploy funcionó:

```json
{
  "ok": true,
  "success": true,
  "data": {
    "activeProjects": 1,
    "activePersonnel": 1,
    "pendingTasks": 0,
    "remainingBudget": 50000,
    "version": "v2.1-REDEPLOY-SUCCESS",
    "timestamp": "2025-08-29T...",
    "sheetsData": {
      "projects": 1,
      "personnel": 1,
      "activities": 0
    }
  }
}
```

### ❌ Si sigue igual:

```json
{
  "activeProjects": 8,
  "activePersonnel": 24,
  "pendingTasks": 12,
  "remainingBudget": 250000
}
```

## 🔍 Troubleshooting

### Si sigue devolviendo valores antiguos:

1. **Espera 2-3 minutos** - Google Apps Script puede tardar en actualizar
2. **Verifica que guardaste** - Asegúrate de que el código se guardó
3. **Revisa la implementación** - Confirma que desplegaste una nueva versión
4. **Prueba en modo incógnito** - Para evitar caché del navegador
5. **Revisa los logs** - Ve a "Ejecuciones" en Google Apps Script para ver errores

### Si hay errores:

1. **Revisa la sintaxis** - Asegúrate de que no hay errores de JavaScript
2. **Verifica permisos** - El script debe tener acceso a Google Sheets
3. **Comprueba el token** - Debe ser exactamente "demo-token-2024"

## 📞 Confirmación

Una vez que veas los nuevos valores (1, 1, 0, 50000), sabremos que el redeploy funciona y podremos implementar la lógica completa.
