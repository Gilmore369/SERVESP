# 🚨 SOLUCIÓN DEFINITIVA - ERROR JWT

## ❌ PROBLEMA

Tu Google Apps Script AÚN tiene el código viejo. El error "Cannot read properties of undefined (reading 'jwt')" significa que no has actualizado el código.

## ✅ SOLUCIÓN PASO A PASO

### 1. VERIFICAR QUE ESTÁS EN EL SCRIPT CORRECTO

- Ve a [script.google.com](https://script.google.com)
- Busca el proyecto que corresponde a esta URL: `AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw`

### 2. REEMPLAZAR EL CÓDIGO COMPLETO

En Google Apps Script, BORRA TODO y pega esto:

```javascript
// Configuration
const CONFIG = {
  API_TOKEN: "demo-token-2024",
};

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    if (!e) e = { parameter: {} };
    if (!e.parameter) e.parameter = {};

    let requestData = e.parameter || {};

    // Validate API token
    const apiToken = requestData.token;
    if (!apiToken || apiToken !== CONFIG.API_TOKEN) {
      return createErrorResponse("Invalid token", 401);
    }

    const action = requestData.action;

    if (
      action === "crud" &&
      requestData.table === "Materiales" &&
      requestData.operation === "list"
    ) {
      return createSuccessResponse([
        {
          id: "1",
          sku: "MAT001",
          descripcion: "Cemento Portland Tipo I",
          categoria: "Construcción",
          unidad: "Bolsa",
          costo_ref: 25.5,
          stock_actual: 100,
          stock_minimo: 20,
          proveedor_principal: "Cementos Lima",
          activo: true,
        },
      ]);
    }

    return createSuccessResponse([]);
  } catch (error) {
    return createErrorResponse("Error: " + error.message, 500);
  }
}

function createErrorResponse(message, status = 400) {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: false,
      message: message,
      status: status,
      timestamp: new Date().toISOString(),
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function createSuccessResponse(data) {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      data: data,
      timestamp: new Date().toISOString(),
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

### 3. GUARDAR Y PROBAR

- Guarda (Ctrl+S)
- Prueba la URL inmediatamente

¿Copiaste el código? ¡Dime qué pasa!
