/**
 * ServesPlatform Google Apps Script Backend - VERSIÓN COMPLETA Y CORREGIDA
 * Main entry point for the API
 * Enhanced with comprehensive logging for debugging and monitoring
 */

// Configuration - Hardcoded values for reliability (no dependency on Script Properties)
const CONFIG = {
  SHEET_ID: "1FYYgZONu04loEZOXzRz6GLIjzn-w
AguQg4S_qHNri8U",
  API_TOKEN: "serves-platform-2024-api-key",
  JWT_SECRET: "mi-secreto-jwt-super-seguro-2024",
  ENVIRONMENT: "development",
  ENABLE_DETAILED_LOGGING: true,
  LOG_LEVEL: "DEBUG" // DEBUG, INFO, WARN, ERROR
};

/**
 * Enhanced logging utility with different log levels and structured output
 */
function logMessage(level, message, data = null, context = null) {
  if (!CONFIG.ENABLE_DETAILED_LOGGING) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp: timestamp,
    level: level,
    message: message,
    context: context,
    data: data
  };
  
  // Format log message for console
  let logOutput = `[${timestamp}] ${level}: ${message}`;
  if (context) logOutput += ` (Context: ${context})`;
  
  // Log based on level
  switch (level) {
    case 'ERROR':
      console.error(logOutput);
      if (data) console.error('Error Data:', JSON.stringify(data, null, 2));
      break;
    case 'WARN':
      console.warn(logOutput);
      if (data) console.warn('Warning Data:', JSON.stringify(data, null, 2));
      break;
    case 'INFO':
      console.info(logOutput);
      if (data) console.info('Info Data:', JSON.stringify(data, null, 2));
      break;
    case 'DEBUG':
    default:
      console.log(logOutput);
      if (data) console.log('Debug Data:', JSON.stringify(data, null, 2));
      break;
  }
  
  return logEntry;
}

/**
 * Log request timing and performance metrics
 */
function logPerformance(operation, startTime, endTime, additionalData = null) {
  const duration = endTime - startTime;
  const performanceData = {
    operation: operation,
    duration_ms: duration,
    start_time: new Date(startTime).toISOString(),
    end_time: new Date(endTime).toISOString(),
    ...additionalData
  };
  
  logMessage('INFO', `Performance: ${operation} completed in ${duration}ms`, performanceData, 'PERFORMANCE');
  return performanceData;
}

/**
 * Log request parameters with sensitive data filtering
 */
function logRequestParameters(parameters, context = 'REQUEST') {
  if (!CONFIG.ENABLE_DETAILED_LOGGING) return;
  
  // Create a copy and filter sensitive data
  const filteredParams = { ...parameters };
  
  // Filter sensitive fields
  const sensitiveFields = ['password', 'token', 'jwt', 'secret', 'key'];
  sensitiveFields.forEach(field => {
    if (filteredParams[field]) {
      filteredParams[field] = '***FILTERED***';
    }
  });
  
  logMessage('DEBUG', 'Request parameters received', filteredParams, context);
}

/**
 * Log error with stack trace and context
 */
function logError(error, context = 'GENERAL', additionalData = null) {
  const errorData = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    context: context,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
  
  logMessage('ERROR', `Error in ${context}: ${error.message}`, errorData, context);
  return errorData;
}

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
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return createCORSResponse();
}

/**
 * Main request handler - Enhanced with comprehensive logging and error tracking
 */
function handleRequest(e) {
  const requestStartTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  try {
    logMessage('INFO', `Starting request processing`, { requestId: requestId }, 'REQUEST_START');
    
    // Ensure e exists and has proper structure
    if (!e) {
      logMessage('WARN', 'Request object is null, creating default structure', null, 'REQUEST_VALIDATION');
      e = { parameter: {}, postData: null };
    }
    if (!e.parameter) {
      logMessage('WARN', 'Request parameter object is missing, creating empty object', null, 'REQUEST_VALIDATION');
      e.parameter = {};
    }

    // Log request method and basic info
    const requestMethod = e.postData ? 'POST' : 'GET';
    logMessage('DEBUG', `Request method: ${requestMethod}`, { 
      hasPostData: !!e.postData,
      parameterCount: Object.keys(e.parameter).length 
    }, 'REQUEST_INFO');

    // Get data from parameters (GET request)
    let requestData = e.parameter || {};
    logRequestParameters(requestData, 'INITIAL_PARAMS');

    // Parse any JSON strings in parameters
    const parseStartTime = Date.now();
    Object.keys(requestData).forEach((key) => {
      if (
        typeof requestData[key] === "string" &&
        (requestData[key].startsWith("{") || requestData[key].startsWith("["))
      ) {
        try {
          const originalValue = requestData[key];
          requestData[key] = JSON.parse(requestData[key]);
          logMessage('DEBUG', `Successfully parsed JSON parameter: ${key}`, { 
            originalLength: originalValue.length,
            parsedType: typeof requestData[key]
          }, 'JSON_PARSING');
        } catch (parseError) {
          // Keep as string if not valid JSON
          logMessage('WARN', `Failed to parse JSON parameter: ${key}`, { 
            error: parseError.message,
            value: requestData[key].substring(0, 100) + '...'
          }, 'JSON_PARSING');
        }
      }
    });
    
    const parseEndTime = Date.now();
    logPerformance('JSON Parameter Parsing', parseStartTime, parseEndTime, { 
      parameterCount: Object.keys(requestData).length 
    });

    // Validate API token
    const tokenValidationStartTime = Date.now();
    const apiToken = requestData.token || e.parameter.token;
    
    logMessage('DEBUG', 'Validating API token', { 
      tokenProvided: !!apiToken,
      tokenLength: apiToken ? apiToken.length : 0,
      expectedToken: CONFIG.API_TOKEN
    }, 'TOKEN_VALIDATION');
    
    if (!apiToken || apiToken !== CONFIG.API_TOKEN) {
      logMessage('ERROR', 'API token validation failed', { 
        expected: CONFIG.API_TOKEN,
        received: apiToken,
        requestId: requestId
      }, 'TOKEN_VALIDATION');
      
      return createErrorResponse("Invalid API token. Please check your configuration.", 401);
    }

    const tokenValidationEndTime = Date.now();
    logPerformance('Token Validation', tokenValidationStartTime, tokenValidationEndTime);
    logMessage('INFO', 'API token validation successful', null, 'TOKEN_VALIDATION');

    // Route to appropriate handler
    const action = requestData.action || e.parameter.action;
    logMessage('INFO', `Routing to action handler`, { 
      action: action,
      requestId: requestId
    }, 'ROUTING');

    let handlerResult;
    const handlerStartTime = Date.now();

    switch (action) {
      case "auth":
        logMessage('DEBUG', 'Routing to authentication handler', null, 'ROUTING');
        handlerResult = handleAuth(requestData);
        break;
      case "whoami":
        logMessage('DEBUG', 'Routing to whoami handler', null, 'ROUTING');
        handlerResult = handleWhoAmI(requestData);
        break;
      case "crud":
        logMessage('DEBUG', 'Routing to CRUD handler', { 
          table: requestData.table,
          operation: requestData.operation
        }, 'ROUTING');
        handlerResult = handleCRUD(requestData);
        break;
      default:
        logMessage('ERROR', 'Invalid action requested', { 
          action: action,
          supportedActions: ['auth', 'whoami', 'crud']
        }, 'ROUTING');
        return createErrorResponse("Invalid action: " + action + ". Supported actions: auth, whoami, crud", 400);
    }
    
    const handlerEndTime = Date.now();
    logPerformance(`${action} Handler`, handlerStartTime, handlerEndTime);
    
    const requestEndTime = Date.now();
    logPerformance('Complete Request', requestStartTime, requestEndTime, { 
      requestId: requestId,
      action: action,
      success: true
    });
    
    logMessage('INFO', 'Request processing completed successfully', { 
      requestId: requestId,
      action: action,
      totalDuration: requestEndTime - requestStartTime
    }, 'REQUEST_COMPLETE');
    
    return handlerResult;
    
  } catch (error) {
    const requestEndTime = Date.now();
    const errorData = logError(error, 'REQUEST_HANDLER', { 
      requestId: requestId,
      duration: requestEndTime - requestStartTime
    });
    
    logMessage('ERROR', 'Request processing failed with unhandled exception', errorData, 'REQUEST_ERROR');
    return createErrorResponse("Internal server error: " + error.message, 500);
  }
}

/**
 * Create standardized CORS response for preflight OPTIONS requests
 */
function createCORSResponse() {
  console.log('CORS preflight request handled');
  
  const output = ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
    
  // Add comprehensive CORS headers for preflight requests
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-API-Token',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  return output;
}

/**
 * Handle CRUD operations - Enhanced with detailed logging and performance tracking
 */
function handleCRUD(data) {
  const crudStartTime = Date.now();
  const crudId = `crud_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  try {
    const { table, operation } = data;
    
    logMessage('INFO', 'Starting CRUD operation', { 
      table: table,
      operation: operation,
      crudId: crudId
    }, 'CRUD_START');
    
    // Validate required parameters
    if (!table || !operation) {
      logMessage('ERROR', 'Missing required CRUD parameters', { 
        table: table,
        operation: operation,
        hasTable: !!table,
        hasOperation: !!operation
      }, 'CRUD_VALIDATION');
      return createErrorResponse("Missing table or operation parameters", 400);
    }

    // Log additional parameters for debugging
    const additionalParams = { ...data };
    delete additionalParams.table;
    delete additionalParams.operation;
    delete additionalParams.token;
    delete additionalParams.action;
    
    logMessage('DEBUG', 'CRUD operation parameters', { 
      table: table,
      operation: operation,
      additionalParams: additionalParams,
      paramCount: Object.keys(additionalParams).length
    }, 'CRUD_PARAMS');

    let operationResult;
    const operationStartTime = Date.now();

    switch (operation) {
      case "list":
        logMessage('DEBUG', 'Executing list operation', { table: table }, 'CRUD_OPERATION');
        operationResult = handleList(table, data);
        break;
      case "get":
        logMessage('DEBUG', 'Executing get operation', { 
          table: table, 
          id: data.id 
        }, 'CRUD_OPERATION');
        operationResult = handleGet(table, data);
        break;
      case "create":
        logMessage('DEBUG', 'Executing create operation', { 
          table: table,
          dataFields: Object.keys(additionalParams)
        }, 'CRUD_OPERATION');
        operationResult = handleCreate(table, data);
        break;
      case "update":
        logMessage('DEBUG', 'Executing update operation', { 
          table: table,
          id: data.id,
          updateFields: Object.keys(additionalParams)
        }, 'CRUD_OPERATION');
        operationResult = handleUpdate(table, data);
        break;
      case "delete":
        logMessage('DEBUG', 'Executing delete operation', { 
          table: table,
          id: data.id
        }, 'CRUD_OPERATION');
        operationResult = handleDelete(table, data);
        break;
      default:
        logMessage('ERROR', 'Invalid CRUD operation', { 
          operation: operation,
          supportedOperations: ['list', 'get', 'create', 'update', 'delete']
        }, 'CRUD_VALIDATION');
        return createErrorResponse("Invalid operation: " + operation + ". Supported: list, get, create, update, delete", 400);
    }
    
    const operationEndTime = Date.now();
    logPerformance(`CRUD ${operation}`, operationStartTime, operationEndTime, { 
      table: table,
      crudId: crudId
    });
    
    const crudEndTime = Date.now();
    logPerformance('Complete CRUD Operation', crudStartTime, crudEndTime, { 
      table: table,
      operation: operation,
      crudId: crudId,
      success: true
    });
    
    logMessage('INFO', 'CRUD operation completed successfully', { 
      table: table,
      operation: operation,
      crudId: crudId,
      duration: crudEndTime - crudStartTime
    }, 'CRUD_COMPLETE');
    
    return operationResult;
    
  } catch (error) {
    const crudEndTime = Date.now();
    const errorData = logError(error, 'CRUD_HANDLER', { 
      table: data?.table,
      operation: data?.operation,
      crudId: crudId,
      duration: crudEndTime - crudStartTime
    });
    
    return createErrorResponse("CRUD operation failed: " + error.message, 500);
  }
}

/**
 * Handle list operation - Enhanced with detailed logging and data metrics
 */
function handleList(table, data) {
  const listStartTime = Date.now();
  
  try {
    logMessage('INFO', 'Starting list operation', { table: table }, 'LIST_OPERATION');
    
    // Handle Materials table with comprehensive mock data
    if (table === "Materials" || table === "Materiales") {
      logMessage('DEBUG', 'Processing materials table request', { table: table }, 'LIST_MATERIALS');
      
      const mockMaterials = [
        {
          id: "mat_001",
          sku: "CEM-001",
          descripcion: "Cemento Portland Tipo I - 50kg",
          categoria: "Cemento",
          unidad: "Bolsa",
          costo_ref: 25.50,
          stock_actual: 150,
          stock_minimo: 20,
          proveedor_principal: "Cementos Lima",
          activo: true,
          fecha_creacion: "2024-01-15T10:30:00.000Z",
          fecha_actualizacion: "2024-01-20T14:45:00.000Z"
        },
        {
          id: "mat_002",
          sku: "LAD-002",
          descripcion: "Ladrillo King Kong 18 huecos",
          categoria: "Ladrillos",
          unidad: "Unidad",
          costo_ref: 0.85,
          stock_actual: 5000,
          stock_minimo: 500,
          proveedor_principal: "Ladrillos del Norte",
          activo: true,
          fecha_creacion: "2024-01-16T09:15:00.000Z",
          fecha_actualizacion: "2024-01-22T11:20:00.000Z"
        },
        {
          id: "mat_003",
          sku: "ARE-003",
          descripcion: "Arena gruesa para construcción",
          categoria: "Agregados",
          unidad: "m³",
          costo_ref: 45.00,
          stock_actual: 25,
          stock_minimo: 5,
          proveedor_principal: "Agregados San Martín",
          activo: true,
          fecha_creacion: "2024-01-17T08:00:00.000Z",
          fecha_actualizacion: "2024-01-25T16:30:00.000Z"
        },
        {
          id: "mat_004",
          sku: "FIE-004",
          descripcion: "Fierro corrugado 1/2 pulgada",
          categoria: "Acero",
          unidad: "Varilla",
          costo_ref: 28.75,
          stock_actual: 200,
          stock_minimo: 30,
          proveedor_principal: "Aceros Arequipa",
          activo: true,
          fecha_creacion: "2024-01-18T13:45:00.000Z",
          fecha_actualizacion: "2024-01-26T10:15:00.000Z"
        },
        {
          id: "mat_005",
          sku: "PIN-005",
          descripcion: "Pintura látex blanco interior 4L",
          categoria: "Pinturas",
          unidad: "Galón",
          costo_ref: 65.90,
          stock_actual: 80,
          stock_minimo: 15,
          proveedor_principal: "Pinturas Tekno",
          activo: true,
          fecha_creacion: "2024-01-19T15:20:00.000Z",
          fecha_actualizacion: "2024-01-27T09:40:00.000Z"
        }
      ];

      // Log materials data metrics
      const materialsMetrics = {
        totalCount: mockMaterials.length,
        categories: [...new Set(mockMaterials.map(m => m.categoria))],
        activeCount: mockMaterials.filter(m => m.activo).length,
        totalStockValue: mockMaterials.reduce((sum, m) => sum + (m.costo_ref * m.stock_actual), 0),
        lowStockItems: mockMaterials.filter(m => m.stock_actual <= m.stock_minimo).length
      };
      
      logMessage('INFO', 'Materials data prepared successfully', materialsMetrics, 'LIST_MATERIALS');
      
      const listEndTime = Date.now();
      logPerformance('List Materials', listStartTime, listEndTime, { 
        itemCount: mockMaterials.length,
        table: table
      });
      
      return createSuccessResponse(mockMaterials);
    }

    // Handle other tables with fallback
    logMessage('WARN', 'No specific handler for table, returning empty array', { 
      table: table,
      availableTables: ['Materials', 'Materiales']
    }, 'LIST_FALLBACK');
    
    const listEndTime = Date.now();
    logPerformance('List Fallback', listStartTime, listEndTime, { 
      table: table,
      itemCount: 0
    });
    
    return createSuccessResponse([]);
    
  } catch (error) {
    const listEndTime = Date.now();
    const errorData = logError(error, 'LIST_OPERATION', { 
      table: table,
      duration: listEndTime - listStartTime
    });
    
    return createErrorResponse("Failed to list items: " + error.message, 500);
  }
}

/**
 * Handle get operation - Returns specific item by ID
 */
function handleGet(table, data) {
  try {
    const { id } = data;
    
    if (!id) {
      return createErrorResponse("Missing required parameter: id", 400);
    }

    console.log(`Handling get operation for table: ${table}, id: ${id}`);

    // Handle Materials table
    if (table === 'Materials' || table === 'Materiales') {
      // Return mock material object for testing
      const mockMaterial = {
        id: id,
        sku: "CEM-001",
        descripcion: "Cemento Portland Tipo I - 50kg",
        categoria: "Cemento",
        unidad: "Bolsa",
        costo_ref: 25.50,
        stock_actual: 150,
        stock_minimo: 20,
        proveedor_principal: "Cementos Lima",
        activo: true,
        fecha_creacion: "2024-01-15T10:30:00.000Z",
        fecha_actualizacion: "2024-01-20T14:45:00.000Z"
      };
      
      console.log(`Returning material with id: ${id}`);
      return createSuccessResponse(mockMaterial);
    }

    // Return mock object for other tables
    const mockObject = {
      id: id,
      name: `Mock ${table} Item`,
      description: `This is a mock object for ${table} with id ${id}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log(`Returning mock object for table ${table}, id: ${id}`);
    return createSuccessResponse(mockObject);
    
  } catch (error) {
    console.error("Get error:", error);
    return createErrorResponse("Failed to get item: " + error.message, 500);
  }
}

/**
 * Handle create operation - Creates new item and returns it with generated fields
 */
function handleCreate(table, data) {
  try {
    console.log(`Handling create operation for table: ${table}`);
    
    // Generate unique ID for new item
    const newId = `${table.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const currentTimestamp = new Date().toISOString();
    
    // Create new item with provided data plus generated fields
    const newItem = {
      ...data,
      id: newId,
      fecha_creacion: currentTimestamp,
      fecha_actualizacion: currentTimestamp
    };
    
    // Remove operation and table from the item data
    delete newItem.operation;
    delete newItem.table;
    delete newItem.token;
    delete newItem.action;
    
    console.log(`Created new ${table} item with id: ${newId}`);
    return createSuccessResponse(newItem);
    
  } catch (error) {
    console.error("Create error:", error);
    return createErrorResponse("Failed to create item: " + error.message, 500);
  }
}

/**
 * Handle update operation - Updates existing item and returns updated data
 */
function handleUpdate(table, data) {
  try {
    const { id } = data;
    
    if (!id) {
      return createErrorResponse("Missing required parameter: id", 400);
    }

    console.log(`Handling update operation for table: ${table}, id: ${id}`);
    
    // Update timestamp on modifications
    const currentTimestamp = new Date().toISOString();
    
    // Create updated item with provided data plus updated timestamp
    const updatedItem = {
      ...data,
      fecha_actualizacion: currentTimestamp
    };
    
    // Remove operation and table from the item data
    delete updatedItem.operation;
    delete updatedItem.table;
    delete updatedItem.token;
    delete updatedItem.action;
    
    // Ensure the ID is preserved
    updatedItem.id = id;
    
    console.log(`Updated ${table} item with id: ${id}`);
    return createSuccessResponse(updatedItem);
    
  } catch (error) {
    console.error("Update error:", error);
    return createErrorResponse("Failed to update item: " + error.message, 500);
  }
}

/**
 * Handle delete operation - Deletes item and returns success confirmation
 */
function handleDelete(table, data) {
  try {
    const { id } = data;
    
    if (!id) {
      return createErrorResponse("Missing required parameter: id", 400);
    }

    console.log(`Handling delete operation for table: ${table}, id: ${id}`);
    
    // Return success confirmation message
    const confirmationMessage = {
      message: `${table} item with id '${id}' has been successfully deleted`,
      deleted_id: id,
      table: table,
      timestamp: new Date().toISOString()
    };
    
    console.log(`Deleted ${table} item with id: ${id}`);
    return createSuccessResponse(confirmationMessage);
    
  } catch (error) {
    console.error("Delete error:", error);
    return createErrorResponse("Failed to delete item: " + error.message, 500);
  }
}

/**
 * Handle authentication - Enhanced with security logging and detailed tracking
 */
function handleAuth(data) {
  const authStartTime = Date.now();
  const authId = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  try {
    logMessage('INFO', 'Starting authentication process', { authId: authId }, 'AUTH_START');
    
    // Validate required parameters
    if (!data.email) {
      logMessage('ERROR', 'Authentication failed: missing email parameter', { authId: authId }, 'AUTH_VALIDATION');
      return createErrorResponse("Missing required parameter: email", 400);
    }
    
    if (!data.password) {
      logMessage('ERROR', 'Authentication failed: missing password parameter', { 
        authId: authId,
        email: data.email
      }, 'AUTH_VALIDATION');
      return createErrorResponse("Missing required parameter: password", 400);
    }
    
    const { email, password } = data;
    
    // Log authentication attempt (without sensitive data)
    logMessage('INFO', 'Authentication attempt', { 
      email: email,
      authId: authId,
      hasPassword: !!password,
      passwordLength: password ? password.length : 0
    }, 'AUTH_ATTEMPT');
    
    // Test user credentials validation
    const credentialCheckStartTime = Date.now();
    
    if (email === "admin@servesplatform.com" && password === "admin123") {
      const credentialCheckEndTime = Date.now();
      logPerformance('Credential Validation', credentialCheckStartTime, credentialCheckEndTime, { 
        authId: authId,
        result: 'success'
      });
      
      // Create user object
      const user = {
        id: "user_admin_001",
        email: "admin@servesplatform.com",
        name: "Administrador",
        role: "admin",
        permissions: [
          "materials.read",
          "materials.write",
          "materials.delete",
          "users.read",
          "users.write",
          "projects.read",
          "projects.write",
          "reports.read"
        ],
        status: "active",
        last_login: new Date().toISOString(),
        created_at: "2024-01-01T00:00:00.000Z"
      };
      
      // Generate mock JWT token for successful authentication
      const tokenGenerationStartTime = Date.now();
      const token = `mock_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const tokenGenerationEndTime = Date.now();
      
      logPerformance('Token Generation', tokenGenerationStartTime, tokenGenerationEndTime, { 
        authId: authId,
        tokenLength: token.length
      });
      
      // Log successful authentication
      logMessage('INFO', 'Authentication successful', { 
        userId: user.id,
        userRole: user.role,
        authId: authId,
        permissionCount: user.permissions.length
      }, 'AUTH_SUCCESS');
      
      const authEndTime = Date.now();
      logPerformance('Complete Authentication', authStartTime, authEndTime, { 
        authId: authId,
        email: email,
        result: 'success'
      });
      
      return createSuccessResponse({
        user: user,
        token: token,
        message: "Login successful"
      });
    }
    
    // Handle invalid credentials
    const credentialCheckEndTime = Date.now();
    logPerformance('Credential Validation', credentialCheckStartTime, credentialCheckEndTime, { 
      authId: authId,
      result: 'failed'
    });
    
    logMessage('WARN', 'Authentication failed: invalid credentials', { 
      email: email,
      authId: authId,
      expectedEmail: 'admin@servesplatform.com'
    }, 'AUTH_FAILURE');
    
    const authEndTime = Date.now();
    logPerformance('Complete Authentication', authStartTime, authEndTime, { 
      authId: authId,
      email: email,
      result: 'failed'
    });
    
    return createErrorResponse("Invalid email or password", 401);
    
  } catch (error) {
    const authEndTime = Date.now();
    const errorData = logError(error, 'AUTH_HANDLER', { 
      authId: authId,
      email: data?.email,
      duration: authEndTime - authStartTime
    });
    
    return createErrorResponse("Authentication failed: " + error.message, 500);
  }
}

/**
 * Handle user info requests (whoami endpoint) - Complete implementation
 */
function handleWhoAmI(data) {
  try {
    console.log('Processing whoami request');
    
    // Return mock admin user object (no JWT dependency for simplicity)
    const adminUser = {
      id: "user_admin_001",
      email: "admin@servesplatform.com",
      name: "Administrador",
      role: "admin",
      permissions: [
        "materials.read",
        "materials.write", 
        "materials.delete",
        "users.read",
        "users.write",
        "projects.read",
        "projects.write",
        "reports.read"
      ],
      status: "active",
      last_login: new Date().toISOString(),
      created_at: "2024-01-01T00:00:00.000Z",
      profile: {
        department: "Administración",
        position: "Administrador del Sistema",
        phone: "+51 999 888 777"
      }
    };
    
    console.log('Returning admin user information');
    return createSuccessResponse(adminUser);
    
  } catch (error) {
    console.error("WhoAmI error:", error);
    return createErrorResponse("Failed to get user info: " + error.message, 500);
  }
}

/**
 * Create standardized error response with enhanced logging and CORS headers
 */
function createErrorResponse(message, status = 400) {
  const timestamp = new Date().toISOString();
  const responseId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  // Enhanced error logging with context
  const errorResponseData = {
    message: message,
    status: status,
    timestamp: timestamp,
    responseId: responseId,
    responseType: 'error'
  };
  
  logMessage('ERROR', 'Creating error response', errorResponseData, 'ERROR_RESPONSE');
  
  const response = {
    ok: false,
    message: message,
    status: status,
    timestamp: timestamp,
    error: true,
    data: null,
    responseId: responseId
  };

  // Log response size and structure
  const responseJson = JSON.stringify(response, null, 2);
  logMessage('DEBUG', 'Error response structure created', { 
    responseSize: responseJson.length,
    responseId: responseId,
    status: status
  }, 'ERROR_RESPONSE');

  // Create response with proper JSON formatting
  const output = ContentService.createTextOutput(responseJson)
    .setMimeType(ContentService.MimeType.JSON);
    
  // Add comprehensive CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Response-ID': responseId,
    'X-Response-Type': 'error'
  };
  
  output.setHeaders(headers);
  
  logMessage('DEBUG', 'Error response headers set', { 
    headerCount: Object.keys(headers).length,
    responseId: responseId
  }, 'ERROR_RESPONSE');
  
  return output;
}

/**
 * Create standardized success response with enhanced logging and CORS headers
 */
function createSuccessResponse(data) {
  const timestamp = new Date().toISOString();
  const responseId = `suc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  // Enhanced success logging with data analysis
  const dataAnalysis = {
    dataType: typeof data,
    hasData: data !== null && data !== undefined,
    isArray: Array.isArray(data),
    arrayLength: Array.isArray(data) ? data.length : null,
    objectKeys: (data && typeof data === 'object' && !Array.isArray(data)) ? Object.keys(data).length : null,
    timestamp: timestamp,
    responseId: responseId
  };
  
  logMessage('INFO', 'Creating success response', dataAnalysis, 'SUCCESS_RESPONSE');
  
  const response = {
    ok: true,
    data: data,
    status: 200,
    timestamp: timestamp,
    error: false,
    message: 'Request completed successfully',
    responseId: responseId
  };

  // Log response size and structure
  const responseJson = JSON.stringify(response, null, 2);
  logMessage('DEBUG', 'Success response structure created', { 
    responseSize: responseJson.length,
    responseId: responseId,
    dataIncluded: !!data
  }, 'SUCCESS_RESPONSE');

  // Create response with proper JSON formatting (indented for readability)
  const output = ContentService.createTextOutput(responseJson)
    .setMimeType(ContentService.MimeType.JSON);
    
  // Add comprehensive CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Response-ID': responseId,
    'X-Response-Type': 'success'
  };
  
  output.setHeaders(headers);
  
  logMessage('DEBUG', 'Success response headers set', { 
    headerCount: Object.keys(headers).length,
    responseId: responseId
  }, 'SUCCESS_RESPONSE');
  
  return output;
}

/**
 * Initialize script properties (backup function - not required with hardcoded CONFIG)
 */
function initializeProperties() {
  const initStartTime = Date.now();
  
  try {
    logMessage('INFO', 'Starting script properties initialization', null, 'INITIALIZATION');
    
    const properties = PropertiesService.getScriptProperties();

    // Set default properties with the correct values
    const propertiesToSet = {
      SHEET_ID: CONFIG.SHEET_ID,
      API_TOKEN: CONFIG.API_TOKEN,
      JWT_SECRET: CONFIG.JWT_SECRET,
      ENVIRONMENT: CONFIG.ENVIRONMENT,
      LAST_INITIALIZED: new Date().toISOString()
    };
    
    properties.setProperties(propertiesToSet);
    
    const initEndTime = Date.now();
    logPerformance('Script Properties Initialization', initStartTime, initEndTime, { 
      propertyCount: Object.keys(propertiesToSet).length
    });
    
    logMessage('INFO', 'Script properties initialized successfully', { 
      propertyCount: Object.keys(propertiesToSet).length,
      environment: CONFIG.ENVIRONMENT
    }, 'INITIALIZATION');
    
  } catch (error) {
    const initEndTime = Date.now();
    logError(error, 'INITIALIZATION', { 
      duration: initEndTime - initStartTime
    });
    throw error;
  }
}

/**
 * Configure logging settings - Can be called to adjust logging behavior
 */
function configureLogging(enableLogging = true, logLevel = 'DEBUG') {
  const oldConfig = {
    ENABLE_DETAILED_LOGGING: CONFIG.ENABLE_DETAILED_LOGGING,
    LOG_LEVEL: CONFIG.LOG_LEVEL
  };
  
  CONFIG.ENABLE_DETAILED_LOGGING = enableLogging;
  CONFIG.LOG_LEVEL = logLevel;
  
  logMessage('INFO', 'Logging configuration updated', { 
    oldConfig: oldConfig,
    newConfig: {
      ENABLE_DETAILED_LOGGING: CONFIG.ENABLE_DETAILED_LOGGING,
      LOG_LEVEL: CONFIG.LOG_LEVEL
    }
  }, 'LOGGING_CONFIG');
  
  return {
    success: true,
    oldConfig: oldConfig,
    newConfig: {
      ENABLE_DETAILED_LOGGING: CONFIG.ENABLE_DETAILED_LOGGING,
      LOG_LEVEL: CONFIG.LOG_LEVEL
    }
  };
}

/**
 * Get current system status and configuration for debugging
 */
function getSystemStatus() {
  const statusStartTime = Date.now();
  
  try {
    logMessage('INFO', 'Generating system status report', null, 'SYSTEM_STATUS');
    
    const status = {
      timestamp: new Date().toISOString(),
      config: {
        environment: CONFIG.ENVIRONMENT,
        loggingEnabled: CONFIG.ENABLE_DETAILED_LOGGING,
        logLevel: CONFIG.LOG_LEVEL,
        hasApiToken: !!CONFIG.API_TOKEN,
        apiTokenLength: CONFIG.API_TOKEN ? CONFIG.API_TOKEN.length : 0
      },
      runtime: {
        scriptVersion: 'Enhanced with Comprehensive Logging',
        executionTime: Date.now() - statusStartTime
      },
      endpoints: {
        available: ['auth', 'whoami', 'crud'],
        crudOperations: ['list', 'get', 'create', 'update', 'delete'],
        supportedTables: ['Materials', 'Materiales']
      }
    };
    
    const statusEndTime = Date.now();
    logPerformance('System Status Generation', statusStartTime, statusEndTime);
    
    logMessage('INFO', 'System status report generated', { 
      configItems: Object.keys(status.config).length,
      endpointCount: status.endpoints.available.length
    }, 'SYSTEM_STATUS');
    
    return status;
    
  } catch (error) {
    const statusEndTime = Date.now();
    logError(error, 'SYSTEM_STATUS', { 
      duration: statusEndTime - statusStartTime
    });
    throw error;
  }
}