/**
 * ServesPlatform Google Apps Script Backend - VERSIÓN SIMPLE Y FUNCIONAL
 * COPIA TODO ESTE CÓDIGO A UN SOLO ARCHIVO Code.gs
 */

// Configuration
const CONFIG = {
  API_TOKEN: "demo-token-2024"
};

/**
 * Main GET handler
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Main POST handler
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Main request handler
 */
function handleRequest(e) {
  try {
    // Ensure e exists
    if (!e) {
      e = { parameter: {} };
    }
    if (!e.parameter) {
      e.parameter = {};
    }

    const params = e.parameter;
    
    // Validate API token
    const apiToken = params.token;
    if (!apiToken || apiToken !== CONFIG.API_TOKEN) {
      return createErrorResponse("Invalid API token", 401);
    }

    // Route to appropriate handler
    const action = params.action;

    switch (action) {
      case "auth":
        return handleAuth(params);
      case "whoami":
        return handleWhoAmI(params);
      case "crud":
        return handleCRUD(params);
      default:
        return createErrorResponse("Invalid action: " + action, 400);
    }
  } catch (error) {
    console.error("Request handling error:", error);
    return createErrorResponse("Internal server error: " + error.message, 500);
  }
}

/**
 * Handle CRUD operations
 */
function handleCRUD(params) {
  try {
    const { table, operation } = params;
    
    if (!table || !operation) {
      return createErrorResponse("Missing table or operation", 400);
    }

    switch (operation) {
      case "list":
        return handleList(table, params);
      case "get":
        return handleGet(table, params);
      case "create":
        return handleCreate(table, params);
      case "update":
        return handleUpdate(table, params);
      case "delete":
        return handleDelete(table, params);
      default:
        return createErrorResponse("Invalid operation: " + operation, 400);
    }
  } catch (error) {
    console.error("CRUD error:", error);
    return createErrorResponse("CRUD operation failed: " + error.message, 500);
  }
}

/**
 * Handle list operation
 */
function handleList(table, params) {
  try {
    if (table === "Materiales") {
      const mockMaterials = [
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
      ];

      return createSuccessResponse(mockMaterials);
    }

    return createSuccessResponse([]);
    
  } catch (error) {
    console.error("List error:", error);
    return createErrorResponse("Failed to list items: " + error.message, 500);
  }
}

/**
 * Handle get operation
 */
function handleGet(table, params) {
  try {
    const { id } = params;
    
    if (!id) {
      return createErrorResponse("Missing ID", 400);
    }

    return createSuccessResponse({ id: id, message: "Item retrieved" });
    
  } catch (error) {
    console.error("Get error:", error);
    return createErrorResponse("Failed to get item: " + error.message, 500);
  }
}

/**
 * Handle create operation
 */
function handleCreate(table, params) {
  try {
    const newItem = {
      id: Date.now().toString(),
      ...params,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    };
    
    return createSuccessResponse(newItem);
    
  } catch (error) {
    console.error("Create error:", error);
    return createErrorResponse("Failed to create item: " + error.message, 500);
  }
}

/**
 * Handle update operation
 */
function handleUpdate(table, params) {
  try {
    const { id } = params;
    
    if (!id) {
      return createErrorResponse("Missing ID", 400);
    }

    const updatedItem = {
      ...params,
      fecha_actualizacion: new Date().toISOString()
    };
    
    return createSuccessResponse(updatedItem);
    
  } catch (error) {
    console.error("Update error:", error);
    return createErrorResponse("Failed to update item: " + error.message, 500);
  }
}

/**
 * Handle delete operation
 */
function handleDelete(table, params) {
  try {
    const { id } = params;
    
    if (!id) {
      return createErrorResponse("Missing ID", 400);
    }

    return createSuccessResponse({ message: "Item deleted successfully" });
    
  } catch (error) {
    console.error("Delete error:", error);
    return createErrorResponse("Failed to delete item: " + error.message, 500);
  }
}

/**
 * Handle authentication
 */
function handleAuth(params) {
  try {
    const { email, password } = params;
    
    if (email === "admin@servesplatform.com" && password === "admin123") {
      const user = {
        id: "1",
        email: "admin@servesplatform.com",
        nombre: "Administrador",
        rol: "admin",
        activo: true
      };
      
      const token = "mock-jwt-token-" + Date.now();
      
      return createSuccessResponse({
        user: user,
        token: token,
        message: "Login successful"
      });
    }
    
    return createErrorResponse("Invalid credentials", 401);
    
  } catch (error) {
    console.error("Auth error:", error);
    return createErrorResponse("Authentication failed: " + error.message, 500);
  }
}

/**
 * Handle whoami
 */
function handleWhoAmI(params) {
  try {
    const user = {
      id: "1",
      email: "admin@servesplatform.com",
      nombre: "Administrador",
      rol: "admin",
      activo: true
    };
    
    return createSuccessResponse(user);
    
  } catch (error) {
    console.error("WhoAmI error:", error);
    return createErrorResponse("Failed to get user info: " + error.message, 500);
  }
}

/**
 * Create error response
 */
function createErrorResponse(message, status = 400) {
  const response = {
    ok: false,
    message: message,
    status: status,
    timestamp: new Date().toISOString(),
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create success response
 */
function createSuccessResponse(data) {
  const response = {
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}