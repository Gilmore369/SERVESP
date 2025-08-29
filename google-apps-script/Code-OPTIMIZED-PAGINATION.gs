/**
 * ServesPlatform Google Apps Script Backend - OPTIMIZED WITH PAGINATION & SEARCH
 * Enhanced server-side pagination, filtering, and search functionality
 * Implements requirements 1.1, 1.2, 1.3, 2.1, 2.2
 */

// Enhanced Configuration
const CONFIG = {
  API_TOKEN: "demo-token-2024",
  ENVIRONMENT: "development",
  // Pagination settings
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 200,
  MIN_PAGE_SIZE: 10,
  // Performance settings
  LARGE_DATASET_THRESHOLD: 1000,
  CACHE_TTL_SECONDS: 300, // 5 minutes
  MAX_SEARCH_RESULTS: 100,
  // Batch operation limits
  MAX_BATCH_SIZE: 100
};

/**
 * Main request handlers
 */
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

/**
 * Enhanced request handler with comprehensive error handling and performance monitoring
 */
function handleRequest(e) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  try {
    console.log(`[${requestId}] Request started`);
    
    // Initialize parameters
    if (!e) e = { parameter: {}, postData: null };
    if (!e.parameter) e.parameter = {};

    let params = e.parameter;

    // Handle POST data
    if (e.postData && e.postData.contents) {
      try {
        const postData = JSON.parse(e.postData.contents);
        params = { ...params, ...postData };
      } catch (error) {
        console.log(`[${requestId}] Failed to parse POST data:`, error);
      }
    }

    // Validate API token
    const token = params.token;
    if (!token || token !== CONFIG.API_TOKEN) {
      return createErrorResponse("Invalid API token", 401, requestId);
    }

    const action = params.action;
    console.log(`[${requestId}] Processing action: ${action}`);

    let result;
    switch (action) {
      case "auth":
        result = handleAuth(params, requestId);
        break;
      case "whoami":
        result = handleWhoAmI(params, requestId);
        break;
      case "crud":
        result = handleOptimizedCRUD(params, requestId);
        break;
      case "batch_crud":
        result = handleBatchCRUD(params, requestId);
        break;
      case "health":
        result = handleHealthCheck(requestId);
        break;
      default:
        return createErrorResponse("Invalid action: " + action, 400, requestId);
    }

    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Request completed in ${duration}ms`);
    
    return result;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] Request failed after ${duration}ms:`, error);
    return createErrorResponse("Internal server error: " + error.message, 500, requestId);
  }
}

/**
 * OPTIMIZED: Enhanced CRUD handler with intelligent operation routing
 */
function handleOptimizedCRUD(params, requestId) {
  const startTime = Date.now();
  
  try {
    const { table, operation } = params;
    
    if (!table || !operation) {
      return createErrorResponse("Missing required parameters: table and operation", 400, requestId);
    }

    console.log(`[${requestId}] CRUD operation: ${operation} on table: ${table}`);

    // Validate table name
    if (!isValidTable(table)) {
      return createErrorResponse(`Invalid table name: ${table}`, 400, requestId);
    }

    let result;
    switch (operation) {
      case "list":
        result = handleOptimizedList(table, params, requestId);
        break;
      case "get":
        result = handleGet(table, params, requestId);
        break;
      case "create":
        result = handleCreate(table, params, requestId);
        break;
      case "update":
        result = handleUpdate(table, params, requestId);
        break;
      case "delete":
        result = handleDelete(table, params, requestId);
        break;
      case "search":
        result = handleAdvancedSearch(table, params, requestId);
        break;
      case "count":
        result = handleCount(table, params, requestId);
        break;
      default:
        return createErrorResponse("Invalid operation: " + operation, 400, requestId);
    }

    const duration = Date.now() - startTime;
    console.log(`[${requestId}] CRUD ${operation} completed in ${duration}ms`);
    
    return result;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] CRUD operation failed after ${duration}ms:`, error);
    return createErrorResponse("CRUD operation failed: " + error.message, 500, requestId);
  }
}

/**
 * OPTIMIZED: Server-side paginated list with intelligent data loading
 */
function handleOptimizedList(table, params, requestId) {
  const startTime = Date.now();
  
  try {
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(
      Math.max(parseInt(params.limit) || CONFIG.DEFAULT_PAGE_SIZE, CONFIG.MIN_PAGE_SIZE),
      CONFIG.MAX_PAGE_SIZE
    );

    // Parse filter and search parameters
    const filters = parseFilters(params.filters);
    const search = (params.search || '').trim();
    const sortBy = params.sort_by || 'id';
    const sortOrder = (params.sort_order || 'asc').toLowerCase();

    console.log(`[${requestId}] List request - Table: ${table}, Page: ${page}, Limit: ${limit}, Search: "${search}"`);

    // Get paginated data using optimized method
    const result = getOptimizedSheetData(table, {
      page,
      limit,
      filters,
      search,
      sortBy,
      sortOrder
    });

    const duration = Date.now() - startTime;
    console.log(`[${requestId}] List operation completed in ${duration}ms - Returned ${result.data.length} records`);

    return createSuccessResponse({
      ...result,
      metadata: {
        table: table,
        execution_time_ms: duration,
        request_id: requestId,
        timestamp: new Date().toISOString()
      }
    }, requestId);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] Optimized list failed after ${duration}ms:`, error);
    return createErrorResponse("Failed to list records: " + error.message, 500, requestId);
  }
}

/**
 * ENHANCED: Advanced search with field weighting and relevance scoring
 */
function handleAdvancedSearch(table, params, requestId) {
  const startTime = Date.now();
  
  try {
    const query = (params.query || '').trim();
    const searchFields = params.search_fields ? params.search_fields.split(',').map(f => f.trim()) : [];
    const limit = Math.min(parseInt(params.limit) || 20, CONFIG.MAX_SEARCH_RESULTS);
    const includeScore = params.include_score === 'true';

    if (!query) {
      return createErrorResponse("Search query is required", 400, requestId);
    }

    console.log(`[${requestId}] Search request - Table: ${table}, Query: "${query}", Fields: [${searchFields.join(', ')}]`);

    // Get all data for search (with caching for performance)
    const allData = getSheetDataCached(table);
    
    // Apply advanced search with scoring
    const searchResults = performAdvancedSearch(allData, query, searchFields, includeScore);
    
    // Limit results
    const results = searchResults.slice(0, limit);

    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Search completed in ${duration}ms - Found ${results.length} results`);

    return createSuccessResponse({
      results: results,
      total_found: searchResults.length,
      query: query,
      search_fields: searchFields,
      metadata: {
        execution_time_ms: duration,
        request_id: requestId,
        include_score: includeScore
      }
    }, requestId);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] Search failed after ${duration}ms:`, error);
    return createErrorResponse("Search failed: " + error.message, 500, requestId);
  }
}

/**
 * NEW: Count operation for efficient record counting with filters
 */
function handleCount(table, params, requestId) {
  const startTime = Date.now();
  
  try {
    const filters = parseFilters(params.filters);
    const search = (params.search || '').trim();

    console.log(`[${requestId}] Count request - Table: ${table}`);

    // For count operations, we can optimize by not loading full data
    const result = getRecordCount(table, filters, search);

    const duration = Date.now() - startTime;
    console.log(`[${requestId}] Count completed in ${duration}ms - Found ${result.count} records`);

    return createSuccessResponse({
      count: result.count,
      table: table,
      filters_applied: Object.keys(filters).length,
      search_applied: !!search,
      metadata: {
        execution_time_ms: duration,
        request_id: requestId
      }
    }, requestId);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] Count failed after ${duration}ms:`, error);
    return createErrorResponse("Count failed: " + error.message, 500, requestId);
  }
}

/**
 * CORE: Optimized sheet data retrieval with intelligent pagination
 */
function getOptimizedSheetData(tableName, options = {}) {
  const {
    page = 1,
    limit = CONFIG.DEFAULT_PAGE_SIZE,
    filters = {},
    search = '',
    sortBy = 'id',
    sortOrder = 'asc'
  } = options;

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(tableName);
    
    if (!sheet) {
      return createEmptyPaginationResult(page, limit);
    }

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return createEmptyPaginationResult(page, limit);
    }

    // Get headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const totalRecords = lastRow - 1;

    // For small datasets or when filters/search are applied, load all data
    if (totalRecords <= CONFIG.LARGE_DATASET_THRESHOLD || Object.keys(filters).length > 0 || search) {
      return processSmallDataset(sheet, headers, totalRecords, options);
    }

    // For large datasets without filters, use server-side pagination
    return processLargeDataset(sheet, headers, totalRecords, options);

  } catch (error) {
    console.error(`Error getting optimized sheet data for ${tableName}:`, error);
    return createEmptyPaginationResult(page, limit);
  }
}

/**
 * UTILITY: Process small datasets with full filtering and search
 */
function processSmallDataset(sheet, headers, totalRecords, options) {
  const { page, limit, filters, search, sortBy, sortOrder } = options;

  // Load all data
  const allData = sheet.getRange(2, 1, totalRecords, sheet.getLastColumn()).getValues();
  let data = allData.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  // Apply filters and search
  data = applyFiltersAndSearch(data, filters, search);
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
    },
    filters_applied: Object.keys(filters).length,
    search_applied: !!search,
    sort: {
      column: sortBy,
      order: sortOrder
    }
  };
}

/**
 * UTILITY: Process large datasets with server-side pagination
 */
function processLargeDataset(sheet, headers, totalRecords, options) {
  const { page, limit, sortBy, sortOrder } = options;

  // Calculate range for server-side pagination
  const offset = (page - 1) * limit;
  const startRow = Math.max(2, offset + 2);
  const endRow = Math.min(startRow + limit - 1, totalRecords + 1);

  if (startRow > totalRecords + 1) {
    return createEmptyPaginationResult(page, limit, totalRecords);
  }

  // Get only the required rows
  const rowCount = endRow - startRow + 1;
  const data = sheet.getRange(startRow, 1, rowCount, sheet.getLastColumn()).getValues();
  
  let result = data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  // Apply sorting if needed (limited sorting for large datasets)
  if (sortBy && sortBy !== 'id') {
    result = applySorting(result, sortBy, sortOrder);
  }

  return {
    data: result,
    pagination: {
      page: page,
      limit: limit,
      total_records: totalRecords,
      filtered_records: totalRecords, // Simplified for large datasets
      total_pages: Math.ceil(totalRecords / limit),
      has_next: endRow < totalRecords + 1,
      has_previous: page > 1
    },
    filters_applied: 0,
    search_applied: false,
    sort: {
      column: sortBy,
      order: sortOrder
    },
    large_dataset_mode: true
  };
}

/**
 * UTILITY: Get cached sheet data for search operations
 */
function getSheetDataCached(tableName) {
  // Simple in-memory cache (in production, use PropertiesService for persistence)
  const cacheKey = `sheet_data_${tableName}`;
  
  try {
    // For now, always fetch fresh data
    // In production, implement proper caching with TTL
    return getSheetDataFull(tableName);
  } catch (error) {
    console.error(`Error getting cached data for ${tableName}:`, error);
    return [];
  }
}

/**
 * UTILITY: Get full sheet data
 */
function getSheetDataFull(tableName) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(tableName);
    
    if (!sheet) {
      return [];
    }

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return [];
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    
    return data.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
  } catch (error) {
    console.error(`Error getting full sheet data for ${tableName}:`, error);
    return [];
  }
}

/**
 * ENHANCED: Advanced search with relevance scoring
 */
function performAdvancedSearch(data, query, searchFields = [], includeScore = false) {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 0);
  
  // Define field weights for relevance scoring
  const fieldWeights = {
    'id': 1,
    'codigo': 3,
    'nombre': 3,
    'titulo': 3,
    'descripcion': 2,
    'sku': 3,
    'email': 2,
    'nombres': 2,
    'razon_social': 2
  };
  
  const results = data.map(record => {
    let score = 0;
    const fieldsToSearch = searchFields.length > 0 ? searchFields : Object.keys(record);
    
    fieldsToSearch.forEach(field => {
      const value = record[field];
      if (value === null || value === undefined) return;
      
      const fieldValue = String(value).toLowerCase();
      const fieldWeight = fieldWeights[field] || 1;
      
      // Exact match bonus
      if (fieldValue === lowerQuery) {
        score += 20 * fieldWeight;
      }
      
      // Contains query bonus
      if (fieldValue.includes(lowerQuery)) {
        score += 10 * fieldWeight;
      }
      
      // Starts with query bonus
      if (fieldValue.startsWith(lowerQuery)) {
        score += 15 * fieldWeight;
      }
      
      // Word match scoring
      queryWords.forEach(word => {
        if (fieldValue.includes(word)) {
          score += 5 * fieldWeight;
        }
      });
    });
    
    const result = includeScore ? { ...record, _search_score: score } : record;
    return { record: result, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.record);
  
  return results;
}

/**
 * UTILITY: Get record count with filters
 */
function getRecordCount(tableName, filters = {}, search = '') {
  try {
    const data = getSheetDataFull(tableName);
    let filteredData = applyFiltersAndSearch(data, filters, search);
    
    return {
      count: filteredData.length,
      total_records: data.length
    };
  } catch (error) {
    console.error(`Error getting record count for ${tableName}:`, error);
    return { count: 0, total_records: 0 };
  }
}

/**
 * UTILITY: Parse filters from string or object
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
 * UTILITY: Apply combined filters and search
 */
function applyFiltersAndSearch(data, filters = {}, search = '') {
  let filteredData = data;

  // Apply search first
  if (search && search.trim()) {
    filteredData = applySearchFilter(filteredData, search.trim());
  }

  // Apply column filters
  if (Object.keys(filters).length > 0) {
    filteredData = applyColumnFilters(filteredData, filters);
  }

  return filteredData;
}

/**
 * UTILITY: Apply search filter across all fields
 */
function applySearchFilter(data, searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return data.filter(record => {
    return Object.values(record).some(value => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerSearchTerm);
    });
  });
}

/**
 * UTILITY: Apply column-specific filters with enhanced operators
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
        
        // Date range filter: {from: "2024-01-01", to: "2024-12-31"}
        if (filterValue.from || filterValue.to) {
          const recordDate = new Date(recordValue);
          if (isNaN(recordDate.getTime())) return false;
          
          if (filterValue.from && recordDate < new Date(filterValue.from)) return false;
          if (filterValue.to && recordDate > new Date(filterValue.to)) return false;
          
          return true;
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
 * UTILITY: Apply sorting with enhanced type handling
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
 * UTILITY: Create empty pagination result
 */
function createEmptyPaginationResult(page, limit, totalRecords = 0) {
  return {
    data: [],
    pagination: {
      page: page,
      limit: limit,
      total_records: totalRecords,
      filtered_records: 0,
      total_pages: 0,
      has_next: false,
      has_previous: page > 1
    },
    filters_applied: 0,
    search_applied: false,
    sort: {
      column: 'id',
      order: 'asc'
    }
  };
}

/**
 * UTILITY: Validate table name
 */
function isValidTable(tableName) {
  const validTables = [
    'Usuarios', 'Clientes', 'Proyectos', 'Actividades', 'Colaboradores',
    'Asignaciones', 'Horas', 'Materiales', 'BOM', 'Config', 'Checklists',
    'ActivityChecklists', 'Evidencias', 'Documentos', 'CategoriaDocumentos',
    'DocumentosProyecto', 'AuditLog'
  ];
  
  return validTables.includes(tableName);
}

/**
 * UTILITY: Generate unique request ID
 */
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * NEW: Health check endpoint
 */
function handleHealthCheck(requestId) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets().map(sheet => ({
      name: sheet.getName(),
      rows: sheet.getLastRow(),
      columns: sheet.getLastColumn()
    }));

    return createSuccessResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      sheets: sheets,
      config: {
        default_page_size: CONFIG.DEFAULT_PAGE_SIZE,
        max_page_size: CONFIG.MAX_PAGE_SIZE,
        large_dataset_threshold: CONFIG.LARGE_DATASET_THRESHOLD
      }
    }, requestId);
    
  } catch (error) {
    return createErrorResponse("Health check failed: " + error.message, 500, requestId);
  }
}

/**
 * ENHANCED: Create success response with metadata
 */
function createSuccessResponse(data, requestId = null) {
  const response = {
    ok: true,
    success: true,
    data: data,
    timestamp: new Date().toISOString(),
    request_id: requestId
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ENHANCED: Create error response with metadata
 */
function createErrorResponse(message, status = 400, requestId = null) {
  const response = {
    ok: false,
    success: false,
    error: true,
    message: message,
    status: status,
    timestamp: new Date().toISOString(),
    request_id: requestId
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Legacy handlers for backward compatibility
function handleAuth(params, requestId) {
  try {
    const email = params.email;
    const password = params.password;
    
    console.log(`[${requestId}] Auth attempt for:`, email);
    
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
      
      return createSuccessResponse(response, requestId);
    }
    
    return createErrorResponse("Credenciales inválidas", 401, requestId);
    
  } catch (error) {
    console.error(`[${requestId}] Auth error:`, error);
    return createErrorResponse("Error de autenticación: " + error.message, 500, requestId);
  }
}

function handleWhoAmI(params, requestId) {
  try {
    const user = {
      id: "1",
      email: "admin@servesplatform.com",
      nombre: "Administrador",
      rol: "admin",
      activo: true,
      timestamp: new Date().toISOString()
    };
    
    return createSuccessResponse(user, requestId);
    
  } catch (error) {
    console.error(`[${requestId}] WhoAmI error:`, error);
    return createErrorResponse("Error al obtener usuario: " + error.message, 500, requestId);
  }
}

// Placeholder implementations for other CRUD operations
function handleGet(table, params, requestId) {
  const id = params.id;
  if (!id) {
    return createErrorResponse("ID requerido", 400, requestId);
  }
  
  const item = {
    id: id,
    table: table,
    message: "Elemento obtenido correctamente"
  };
  
  return createSuccessResponse(item, requestId);
}

function handleCreate(table, params, requestId) {
  const newItem = {
    id: Date.now().toString(),
    table: table,
    message: "Elemento creado correctamente",
    fecha_creacion: new Date().toISOString()
  };
  
  return createSuccessResponse(newItem, requestId);
}

function handleUpdate(table, params, requestId) {
  const id = params.id;
  if (!id) {
    return createErrorResponse("ID requerido", 400, requestId);
  }
  
  const updatedItem = {
    id: id,
    table: table,
    message: "Elemento actualizado correctamente",
    fecha_actualizacion: new Date().toISOString()
  };
  
  return createSuccessResponse(updatedItem, requestId);
}

function handleDelete(table, params, requestId) {
  const id = params.id;
  if (!id) {
    return createErrorResponse("ID requerido", 400, requestId);
  }
  
  const result = {
    id: id,
    table: table,
    message: "Elemento eliminado correctamente"
  };
  
  return createSuccessResponse(result, requestId);
}

function handleBatchCRUD(params, requestId) {
  const { operations } = params;
  
  if (!operations || !Array.isArray(operations)) {
    return createErrorResponse("Missing or invalid operations array", 400, requestId);
  }

  if (operations.length > CONFIG.MAX_BATCH_SIZE) {
    return createErrorResponse(`Batch size exceeds maximum of ${CONFIG.MAX_BATCH_SIZE}`, 400, requestId);
  }

  const results = operations.map((operation, index) => ({
    index: index,
    operation: operation.operation,
    table: operation.table,
    success: true,
    data: { message: "Batch operation simulated" }
  }));

  return createSuccessResponse({
    results: results,
    total_operations: operations.length,
    successful_operations: results.length,
    failed_operations: 0
  }, requestId);
}