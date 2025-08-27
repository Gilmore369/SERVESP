// ServesPlatform API - Versión Final que Maneja JWT
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

    // Parse JSON strings in parameters
    Object.keys(requestData).forEach((key) => {
      if (typeof requestData[key] === "string" && 
          (requestData[key].startsWith("{") || requestData[key].startsWith("["))) {
        try {
          requestData[key] = JSON.parse(requestData[key]);
        } catch (parseError) {
          // Keep as string if not valid JSON
        }
      }
    });

    // Validate API token
    const apiToken = requestData.token;
    if (!apiToken || apiToken !== CONFIG.API_TOKEN) {
      return createErrorResponse("Invalid token. Expected: " + CONFIG.API_TOKEN + ", Got: " + apiToken, 401);
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
    console.error("Request error:", error);
    return createErrorResponse("Internal server error: " + error.message, 500);
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