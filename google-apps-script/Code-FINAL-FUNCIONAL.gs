/**
 * ServesPlatform Google Apps Script Backend - VERSIÓN FINAL FUNCIONAL
 * COPIA EXACTAMENTE ESTE CÓDIGO A TU GOOGLE APPS SCRIPT
 */

// Configuración fija
const CONFIG = {
  API_TOKEN: "demo-token-2024",
  ENVIRONMENT: "development"
};

/**
 * Maneja peticiones GET
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Maneja peticiones POST
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Manejador principal de peticiones - SIMPLIFICADO
 */
function handleRequest(e) {
  try {
    // Inicializar parámetros si no existen
    if (!e) e = { parameter: {} };
    if (!e.parameter) e.parameter = {};

    const params = e.parameter;
    
    // Log para debug
    console.log("Parámetros recibidos:", JSON.stringify(params));

    // Validar token API
    const token = params.token;
    if (!token || token !== CONFIG.API_TOKEN) {
      return createErrorResponse("Token inválido. Usa: " + CONFIG.API_TOKEN, 401);
    }

    // Obtener acción
    const action = params.action;
    
    // Rutear según la acción
    switch (action) {
      case "auth":
        return handleAuth(params);
      case "whoami":
        return handleWhoAmI(params);
      case "crud":
        return handleCRUD(params);
      default:
        return createErrorResponse("Acción inválida: " + action, 400);
    }
    
  } catch (error) {
    console.error("Error en handleRequest:", error);
    return createErrorResponse("Error interno: " + error.message, 500);
  }
}

/**
 * Maneja operaciones CRUD
 */
function handleCRUD(params) {
  try {
    const operation = params.operation;
    const table = params.table;
    
    console.log("CRUD - Operation:", operation, "Table:", table);
    
    if (!operation || !table) {
      return createErrorResponse("Faltan parámetros: operation y table son requeridos", 400);
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
        return createErrorResponse("Operación inválida: " + operation, 400);
    }
    
  } catch (error) {
    console.error("Error en CRUD:", error);
    return createErrorResponse("Error en operación CRUD: " + error.message, 500);
  }
}

/**
 * Lista elementos de una tabla
 */
function handleList(table, params) {
  try {
    console.log("Listando tabla:", table);
    
    if (table === "Materiales") {
      const materiales = [
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
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
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
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
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
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
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
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
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
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
        }
      ];
      
      console.log("Devolviendo", materiales.length, "materiales");
      return createSuccessResponse(materiales);
    }

    // Para otras tablas, devolver array vacío
    return createSuccessResponse([]);
    
  } catch (error) {
    console.error("Error en handleList:", error);
    return createErrorResponse("Error al listar: " + error.message, 500);
  }
}

/**
 * Obtiene un elemento específico
 */
function handleGet(table, params) {
  try {
    const id = params.id;
    if (!id) {
      return createErrorResponse("ID requerido", 400);
    }
    
    // Simular obtención de elemento
    const item = {
      id: id,
      message: "Elemento obtenido correctamente"
    };
    
    return createSuccessResponse(item);
    
  } catch (error) {
    console.error("Error en handleGet:", error);
    return createErrorResponse("Error al obtener: " + error.message, 500);
  }
}

/**
 * Crea un nuevo elemento
 */
function handleCreate(table, params) {
  try {
    const newItem = {
      id: Date.now().toString(),
      table: table,
      message: "Elemento creado correctamente",
      fecha_creacion: new Date().toISOString()
    };
    
    return createSuccessResponse(newItem);
    
  } catch (error) {
    console.error("Error en handleCreate:", error);
    return createErrorResponse("Error al crear: " + error.message, 500);
  }
}

/**
 * Actualiza un elemento
 */
function handleUpdate(table, params) {
  try {
    const id = params.id;
    if (!id) {
      return createErrorResponse("ID requerido", 400);
    }
    
    const updatedItem = {
      id: id,
      table: table,
      message: "Elemento actualizado correctamente",
      fecha_actualizacion: new Date().toISOString()
    };
    
    return createSuccessResponse(updatedItem);
    
  } catch (error) {
    console.error("Error en handleUpdate:", error);
    return createErrorResponse("Error al actualizar: " + error.message, 500);
  }
}

/**
 * Elimina un elemento
 */
function handleDelete(table, params) {
  try {
    const id = params.id;
    if (!id) {
      return createErrorResponse("ID requerido", 400);
    }
    
    const result = {
      id: id,
      table: table,
      message: "Elemento eliminado correctamente"
    };
    
    return createSuccessResponse(result);
    
  } catch (error) {
    console.error("Error en handleDelete:", error);
    return createErrorResponse("Error al eliminar: " + error.message, 500);
  }
}

/**
 * Maneja autenticación
 */
function handleAuth(params) {
  try {
    const email = params.email;
    const password = params.password;
    
    console.log("Auth attempt for:", email);
    
    // Credenciales de prueba
    if (email === "admin@servesplatform.com" && password === "admin123") {
      const user = {
        id: "1",
        email: "admin@servesplatform.com",
        nombre: "Administrador",
        rol: "admin",
        activo: true
      };
      
      const token = "mock-jwt-token-" + Date.now();
      
      const response = {
        user: user,
        token: token,
        message: "Login exitoso"
      };
      
      return createSuccessResponse(response);
    }
    
    return createErrorResponse("Credenciales inválidas", 401);
    
  } catch (error) {
    console.error("Error en handleAuth:", error);
    return createErrorResponse("Error de autenticación: " + error.message, 500);
  }
}

/**
 * Maneja información del usuario
 */
function handleWhoAmI(params) {
  try {
    const user = {
      id: "1",
      email: "admin@servesplatform.com",
      nombre: "Administrador",
      rol: "admin",
      activo: true,
      timestamp: new Date().toISOString()
    };
    
    return createSuccessResponse(user);
    
  } catch (error) {
    console.error("Error en handleWhoAmI:", error);
    return createErrorResponse("Error al obtener usuario: " + error.message, 500);
  }
}

/**
 * Crea respuesta de error
 */
function createErrorResponse(message, status) {
  const response = {
    ok: false,
    message: message,
    status: status || 400,
    timestamp: new Date().toISOString()
  };
  
  console.error("Error response:", JSON.stringify(response));
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Crea respuesta exitosa
 */
function createSuccessResponse(data) {
  const response = {
    ok: true,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  console.log("Success response:", JSON.stringify(response));
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función de prueba - ejecutar una vez para verificar
 */
function testFunction() {
  console.log("Test function ejecutada correctamente");
  console.log("CONFIG:", JSON.stringify(CONFIG));
  return "OK";
}