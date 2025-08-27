# 🚀 CREAR NUEVO GOOGLE APPS SCRIPT DESDE CERO

## ✅ PASO A PASO

### 1. CREAR NUEVO PROYECTO
1. Ve a [script.google.com](https://script.google.com)
2. Haz clic en **"+ Nuevo proyecto"**
3. Se abrirá un editor con código por defecto

### 2. REEMPLAZAR EL CÓDIGO
**BORRA TODO** el código que aparece y pega esto:

```javascript
// ServesPlatform API - Versión Simple
const CONFIG = {
  API_TOKEN: "demo-token-2024"
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
    const table = requestData.table;
    const operation = requestData.operation;

    // Handle materiales
    if (action === "crud" && table === "Materiales" && operation === "list") {
      return createSuccessResponse([
        {
          id: "1",
          sku: "MAT001",
          descripcion: "Cemento Portland Tipo I",
          categoria: "Construcción",
          unidad: "Bolsa",
          costo_ref: 25.50,
          stock_actual: 100,
          stock_minimo: 20,
          proveedor_principal: "Cementos Lima",
          activo: true,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        },
        {
          id: "2",
          sku: "MAT002",
          descripcion: "Fierro de Construcción 1/2\"",
          categoria: "Construcción",
          unidad: "Varilla",
          costo_ref: 35.00,
          stock_actual: 50,
          stock_minimo: 10,
          proveedor_principal: "Aceros Arequipa",
          activo: true,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        },
        {
          id: "3",
          sku: "MAT003",
          descripcion: "Ladrillo King Kong 18 huecos",
          categoria: "Construcción",
          unidad: "Unidad",
          costo_ref: 0.85,
          stock_actual: 5,
          stock_minimo: 100,
          proveedor_principal: "Ladrillera Norte",
          activo: true,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        },
        {
          id: "4",
          sku: "MAT004",
          descripcion: "Arena Gruesa",
          categoria: "Agregados",
          unidad: "m³",
          costo_ref: 45.00,
          stock_actual: 0,
          stock_minimo: 5,
          proveedor_principal: "Agregados del Sur",
          activo: true,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        },
        {
          id: "5",
          sku: "MAT005",
          descripcion: "Pintura Látex Blanco",
          categoria: "Acabados",
          unidad: "Galón",
          costo_ref: 85.00,
          stock_actual: 15,
          stock_minimo: 5,
          proveedor_principal: "Pinturas Tekno",
          activo: true,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        }
      ]);
    }

    // Handle auth
    if (action === "auth") {
      const { email, password } = requestData;
      if (email === "admin@servesplatform.com" && password === "admin123") {
        return createSuccessResponse({
          user: {
            id: "1",
            email: "admin@servesplatform.com",
            nombre: "Administrador",
            rol: "admin",
            activo: true
          },
          token: "mock-jwt-token-" + Date.now(),
          message: "Login successful"
        });
      }
      return createErrorResponse("Invalid credentials", 401);
    }

    // Handle whoami
    if (action === "whoami") {
      return createSuccessResponse({
        id: "1",
        email: "admin@servesplatform.com",
        nombre: "Administrador",
        rol: "admin",
        activo: true
      });
    }

    return createSuccessResponse([]);
  } catch (error) {
    return createErrorResponse("Error: " + error.message, 500);
  }
}

function createErrorResponse(message, status = 400) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: false,
    message: message,
    status: status,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function createSuccessResponse(data) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    data: data,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### 3. GUARDAR EL PROYECTO
1. Haz clic en **"Proyecto sin título"** arriba
2. Cambia el nombre a **"ServesPlatform-API"**
3. Presiona **Ctrl+S** para guardar

### 4. DESPLEGAR COMO APLICACIÓN WEB
1. Haz clic en **"Desplegar"** > **"Nueva implementación"**
2. En **"Tipo"**, selecciona **"Aplicación web"**
3. Configuración:
   - **Ejecutar como**: Yo (tu email)
   - **Quién puede acceder**: Cualquier persona
4. Haz clic en **"Desplegar"**
5. **COPIA LA URL** que te da (algo como `https://script.google.com/macros/s/ABC123.../exec`)

### 5. ACTUALIZAR TU .ENV.LOCAL
Reemplaza la URL en tu archivo `.env.local` con la nueva URL que copiaste.

### 6. PROBAR
Abre la nueva URL en tu navegador agregando los parámetros:
```
TU_NUEVA_URL?token=demo-token-2024&action=crud&table=Materiales&operation=list
```

## 🎯 RESULTADO ESPERADO
Deberías ver una respuesta JSON con 5 materiales.

¿Puedes seguir estos pasos y decirme qué URL te genera?