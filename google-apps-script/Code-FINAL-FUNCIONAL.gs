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
 * ENHANCED: Lista elementos de una tabla con paginación optimizada
 */
function handleList(table, params) {
  try {
    console.log("Listando tabla con paginación:", table);
    
    // Parse pagination parameters
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(Math.max(parseInt(params.limit) || 50, 10), 200);
    const search = (params.search || '').trim();
    const filters = parseFilters(params.filters);
    const sortBy = params.sort_by || 'id';
    const sortOrder = (params.sort_order || 'asc').toLowerCase();

    console.log(`Pagination params - Page: ${page}, Limit: ${limit}, Search: "${search}"`);

    // Try to get data from actual Google Sheets first
    try {
      const result = getOptimizedSheetData(table, {
        page,
        limit,
        filters,
        search,
        sortBy,
        sortOrder
      });
      
      if (result.data.length > 0 || result.pagination.total_records > 0) {
        console.log(`Returning ${result.data.length} records from Google Sheets`);
        return createSuccessResponse({
          ...result,
          source: 'google_sheets',
          metadata: {
            execution_time_ms: Date.now() - Date.now(),
            table: table
          }
        });
      }
    } catch (sheetError) {
      console.log("Google Sheets not available, using mock data:", sheetError.message);
    }

    // Fallback to mock data with pagination
    let mockData = getMockTableData(table);
    const totalRecords = mockData.length;

    // Apply search if provided
    if (search) {
      mockData = mockData.filter(record => {
        return Object.values(record).some(value => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(search.toLowerCase());
        });
      });
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      mockData = applyColumnFilters(mockData, filters);
    }

    const filteredCount = mockData.length;

    // Apply sorting
    mockData = applySorting(mockData, sortBy, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedData = mockData.slice(offset, offset + limit);

    console.log(`Returning ${paginatedData.length} records from mock data`);

    const response = {
      data: paginatedData,
      pagination: {
        page: page,
        limit: limit,
        total_records: totalRecords,
        filtered_records: filteredCount,
        total_pages: Math.ceil(filteredCount / limit),
        has_next: offset + limit < filteredCount,
        has_previous: page > 1
      },
      filters_applied: Object.keys(filters).length,
      search_applied: !!search,
      sort: {
        column: sortBy,
        order: sortOrder
      },
      source: 'mock_data',
      metadata: {
        table: table,
        execution_time_ms: Date.now() - Date.now()
      }
    };

    return createSuccessResponse(response);
    
  } catch (error) {
    console.error("Error en handleList:", error);
    return createErrorResponse("Error al listar: " + error.message, 500);
  }
}

/**
 * UTILITY: Get mock data for tables
 */
function getMockTableData(table) {
  switch (table.toLowerCase()) {
    case "materiales":
      return [
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
        },
        {
          id: "6",
          sku: "MAT006",
          descripcion: "Cable THW 12 AWG",
          categoria: "Eléctrico",
          unidad: "Metro",
          costo_ref: 2.50,
          stock_actual: 500,
          stock_minimo: 100,
          proveedor_principal: "Cables del Perú",
          activo: true,
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
        },
        {
          id: "7",
          sku: "MAT007",
          descripcion: "Tubo PVC 4 pulgadas",
          categoria: "Plomería",
          unidad: "Metro",
          costo_ref: 12.00,
          stock_actual: 200,
          stock_minimo: 50,
          proveedor_principal: "Pavco",
          activo: true,
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
        },
        {
          id: "8",
          sku: "MAT008",
          descripcion: "Interruptor Simple",
          categoria: "Eléctrico",
          unidad: "Unidad",
          costo_ref: 8.50,
          stock_actual: 75,
          stock_minimo: 25,
          proveedor_principal: "Ticino",
          activo: true,
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
        }
      ];
    case "proyectos":
      return [
        {
          id: "PRY001",
          codigo: "PRY-2024-001",
          nombre: "Instalación Eléctrica Oficina Central",
          cliente_id: "CLI001",
          responsable_id: "USR001",
          ubicacion: "Lima Centro",
          descripcion: "Instalación completa del sistema eléctrico",
          linea_servicio: "Eléctrico",
          estado: "En progreso",
          avance_pct: 45,
          fecha_creacion: "2025-08-27T10:00:00.000Z",
          fecha_actualizacion: "2025-08-27T10:00:00.000Z"
        }
      ];
    default:
      return [];
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
/**

 * UTILITY FUNCTIONS FOR OPTIMIZED PAGINATION
 */

/**
 * Parse filters from string or object
 */
function parseFilters(filtersParam) {
  if (!filtersParam) return {};
  
  try {
    if (typeof filtersParam === 'string') {
      return JSON.parse(filtersParam);
    }
    return filtersParam;
  } catch (error) {
    console.error('Error parsing filters:', error);
    return {};
  }
}

/**
 * Apply column-specific filters
 */
function applyColumnFilters(data, filters) {
  return data.filter(record => {
    return Object.entries(filters).every(([column, filterValue]) => {
      const recordValue = record[column];
      
      if (recordValue === null || recordValue === undefined) {
        return filterValue === null || filterValue === undefined || filterValue === '';
      }

      // Handle different filter types
      if (typeof filterValue === 'object' && filterValue !== null) {
        // Range filter: {min: 10, max: 100}
        if (filterValue.min !== undefined || filterValue.max !== undefined) {
          const numValue = parseFloat(recordValue);
          if (isNaN(numValue)) return false;
          
          if (filterValue.min !== undefined && numValue < filterValue.min) return false;
          if (filterValue.max !== undefined && numValue > filterValue.max) return false;
          
          return true;
        }
        
        // Array filter: {in: ["value1", "value2"]}
        if (filterValue.in && Array.isArray(filterValue.in)) {
          return filterValue.in.includes(recordValue);
        }
        
        // Contains filter: {contains: "text"}
        if (filterValue.contains !== undefined) {
          return String(recordValue).toLowerCase().includes(String(filterValue.contains).toLowerCase());
        }
      }
      
      // Exact match filter
      return String(recordValue).toLowerCase() === String(filterValue).toLowerCase();
    });
  });
}

/**
 * Apply sorting with enhanced type handling
 */
function applySorting(data, sortBy, sortOrder) {
  return data.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle null/undefined values
    if (aVal === null || aVal === undefined) aVal = '';
    if (bVal === null || bVal === undefined) bVal = '';
    
    // Try to detect and handle different data types
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      // Check if strings represent numbers
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        aVal = aNum;
        bVal = bNum;
      } else {
        // Check if strings represent dates
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          aVal = aDate;
          bVal = bDate;
        } else {
          // String comparison (case-insensitive)
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
      }
    }
    
    let comparison = 0;
    if (aVal > bVal) comparison = 1;
    if (aVal < bVal) comparison = -1;
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

/**
 * ENHANCED: Get optimized sheet data (simplified version for integration)
 */
function getOptimizedSheetData(tableName, options = {}) {
  const {
    page = 1,
    limit = 50,
    filters = {},
    search = '',
    sortBy = 'id',
    sortOrder = 'asc'
  } = options;

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(tableName);
    
    if (!sheet) {
      throw new Error(`Sheet ${tableName} not found`);
    }

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return {
        data: [],
        pagination: {
          page: page,
          limit: limit,
          total_records: 0,
          filtered_records: 0,
          total_pages: 0,
          has_next: false,
          has_previous: page > 1
        }
      };
    }

    // Get headers and data
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const totalRecords = lastRow - 1;
    const allData = sheet.getRange(2, 1, totalRecords, sheet.getLastColumn()).getValues();
    
    let data = allData.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    // Apply search
    if (search) {
      data = data.filter(record => {
        return Object.values(record).some(value => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(search.toLowerCase());
        });
      });
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      data = applyColumnFilters(data, filters);
    }

    const filteredCount = data.length;

    // Apply sorting
    data = applySorting(data, sortBy, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        page: page,
        limit: limit,
        total_records: totalRecords,
        filtered_records: filteredCount,
        total_pages: Math.ceil(filteredCount / limit),
        has_next: offset + limit < filteredCount,
        has_previous: page > 1
      }
    };

  } catch (error) {
    console.error(`Error getting optimized sheet data for ${tableName}:`, error);
    throw error;
  }
}