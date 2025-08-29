# Optimized Pagination and Search Documentation

## Overview

This document describes the enhanced pagination and search functionality implemented for the ServesPlatform Google Apps Script backend. The implementation addresses requirements 1.1, 1.2, 1.3, 2.1, and 2.2 by providing efficient server-side pagination, advanced filtering, and optimized search capabilities.

## Features Implemented

### 1. Server-Side Pagination

#### Basic Pagination
- **Endpoint**: `action=crud&operation=list`
- **Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Records per page (default: 50, max: 200, min: 10)
  - `table`: Target table name

#### Example Request
```javascript
{
  "token": "demo-token-2024",
  "action": "crud",
  "table": "Materiales",
  "operation": "list",
  "page": 1,
  "limit": 20
}
```

#### Response Format
```javascript
{
  "ok": true,
  "data": {
    "data": [...], // Array of records
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_records": 150,
      "filtered_records": 150,
      "total_pages": 8,
      "has_next": true,
      "has_previous": false
    },
    "filters_applied": 0,
    "search_applied": false,
    "sort": {
      "column": "id",
      "order": "asc"
    },
    "metadata": {
      "execution_time_ms": 45,
      "request_id": "abc123"
    }
  }
}
```

### 2. Advanced Filtering

#### Column Filters
Support for multiple filter types:

##### Exact Match
```javascript
{
  "filters": "{\"categoria\": \"Construcción\", \"activo\": true}"
}
```

##### Range Filters
```javascript
{
  "filters": "{\"stock_actual\": {\"min\": 10, \"max\": 100}}"
}
```

##### Array Filters (IN operator)
```javascript
{
  "filters": "{\"categoria\": {\"in\": [\"Construcción\", \"Agregados\"]}}"
}
```

##### Date Range Filters
```javascript
{
  "filters": "{\"created_at\": {\"from\": \"2024-01-01\", \"to\": \"2024-12-31\"}}"
}
```

##### Contains Filter
```javascript
{
  "filters": "{\"descripcion\": {\"contains\": \"cemento\"}}"
}
```

### 3. Search Functionality

#### Basic Search
- **Parameter**: `search`
- Searches across all fields in the record
- Case-insensitive matching

```javascript
{
  "search": "cemento portland"
}
```

#### Advanced Search
- **Endpoint**: `action=crud&operation=search`
- **Features**:
  - Field-specific search
  - Relevance scoring
  - Weighted results

```javascript
{
  "token": "demo-token-2024",
  "action": "crud",
  "table": "Materiales",
  "operation": "search",
  "query": "cemento",
  "search_fields": "descripcion,categoria",
  "limit": 10,
  "include_score": true
}
```

#### Search Response
```javascript
{
  "ok": true,
  "data": {
    "results": [...], // Sorted by relevance
    "total_found": 25,
    "query": "cemento",
    "search_fields": ["descripcion", "categoria"],
    "metadata": {
      "execution_time_ms": 32,
      "include_score": true
    }
  }
}
```

### 4. Sorting

#### Parameters
- `sort_by`: Column name to sort by
- `sort_order`: "asc" or "desc"

#### Intelligent Type Detection
The system automatically detects and handles:
- Numeric values
- Date values
- String values (case-insensitive)

```javascript
{
  "sort_by": "stock_actual",
  "sort_order": "desc"
}
```

### 5. Performance Optimizations

#### Dataset Size Handling
- **Small datasets** (≤1000 records): Full in-memory processing
- **Large datasets** (>1000 records): Server-side pagination with limited filtering

#### Caching Strategy
- Sheet data caching for search operations
- Request-level performance monitoring
- Execution time tracking

#### Batch Operations
- **Endpoint**: `action=batch_crud`
- Process multiple operations in a single request
- Maximum batch size: 100 operations

```javascript
{
  "token": "demo-token-2024",
  "action": "batch_crud",
  "operations": [
    {
      "table": "Materiales",
      "operation": "list",
      "page": 1,
      "limit": 10
    },
    {
      "table": "Proyectos",
      "operation": "list",
      "page": 1,
      "limit": 5
    }
  ]
}
```

## API Endpoints

### 1. List with Pagination
```
POST /exec
{
  "token": "demo-token-2024",
  "action": "crud",
  "table": "TableName",
  "operation": "list",
  "page": 1,
  "limit": 50,
  "filters": "{}",
  "search": "",
  "sort_by": "id",
  "sort_order": "asc"
}
```

### 2. Advanced Search
```
POST /exec
{
  "token": "demo-token-2024",
  "action": "crud",
  "table": "TableName",
  "operation": "search",
  "query": "search term",
  "search_fields": "field1,field2",
  "limit": 20,
  "include_score": true
}
```

### 3. Count Records
```
POST /exec
{
  "token": "demo-token-2024",
  "action": "crud",
  "table": "TableName",
  "operation": "count",
  "filters": "{}",
  "search": ""
}
```

### 4. Health Check
```
POST /exec
{
  "token": "demo-token-2024",
  "action": "health"
}
```

## Configuration

### Default Settings
```javascript
const CONFIG = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 200,
  MIN_PAGE_SIZE: 10,
  LARGE_DATASET_THRESHOLD: 1000,
  CACHE_TTL_SECONDS: 300,
  MAX_SEARCH_RESULTS: 100,
  MAX_BATCH_SIZE: 100
};
```

## Supported Tables

- Usuarios
- Clientes
- Proyectos
- Actividades
- Colaboradores
- Asignaciones
- Horas
- Materiales
- BOM
- Config
- Checklists
- ActivityChecklists
- Evidencias
- Documentos
- CategoriaDocumentos
- DocumentosProyecto
- AuditLog

## Error Handling

### Common Error Responses

#### Invalid Parameters
```javascript
{
  "ok": false,
  "error": true,
  "message": "Missing required parameters: table and operation",
  "status": 400,
  "request_id": "abc123"
}
```

#### Invalid Table
```javascript
{
  "ok": false,
  "error": true,
  "message": "Invalid table name: InvalidTable",
  "status": 400,
  "request_id": "abc123"
}
```

#### Authentication Error
```javascript
{
  "ok": false,
  "error": true,
  "message": "Invalid API token",
  "status": 401,
  "request_id": "abc123"
}
```

## Performance Benchmarks

### Typical Response Times
- Small page (10 records): ~50ms
- Medium page (50 records): ~100ms
- Large page (100 records): ~200ms
- Max page (200 records): ~400ms
- Search operation: ~150ms
- Count operation: ~75ms

### Memory Usage
- Optimized for Google Apps Script memory limits
- Efficient data processing for large datasets
- Minimal memory footprint for pagination

## Testing

### Test Suite
Run the comprehensive test suite:
```javascript
runComprehensiveTests()
```

### Individual Tests
- `testBasicPagination()`
- `testPaginationWithFilters()`
- `testSearchFunctionality()`
- `testAdvancedSearch()`
- `testSorting()`
- `testLargeDatasetHandling()`
- `testErrorHandling()`
- `testPerformance()`

### Performance Benchmarking
```javascript
benchmarkPerformance()
```

## Migration Guide

### From Previous Version
1. Update the Google Apps Script code with the new optimized version
2. Test pagination parameters in your frontend
3. Update API calls to use new response format
4. Implement error handling for new error responses

### Frontend Integration
```javascript
// Example frontend integration
async function fetchMaterials(page = 1, limit = 20, search = '') {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: API_TOKEN,
      action: 'crud',
      table: 'Materiales',
      operation: 'list',
      page: page,
      limit: limit,
      search: search
    })
  });
  
  const result = await response.json();
  
  if (result.ok) {
    return {
      data: result.data.data,
      pagination: result.data.pagination,
      metadata: result.data.metadata
    };
  } else {
    throw new Error(result.message);
  }
}
```

## Best Practices

### 1. Pagination
- Use reasonable page sizes (20-50 records)
- Implement infinite scroll or pagination controls
- Cache pagination state in frontend

### 2. Search
- Debounce search input to avoid excessive requests
- Use field-specific search when possible
- Implement search result highlighting

### 3. Filtering
- Combine filters efficiently
- Use appropriate filter types for data types
- Provide filter reset functionality

### 4. Performance
- Monitor execution times
- Use count operations for total record display
- Implement client-side caching where appropriate

### 5. Error Handling
- Always check response.ok before processing data
- Implement retry logic for network errors
- Provide user-friendly error messages

## Troubleshooting

### Common Issues

#### Slow Performance
- Check dataset size and use appropriate pagination
- Verify filter complexity
- Monitor Google Apps Script execution time limits

#### Memory Errors
- Reduce page size for large datasets
- Simplify complex filters
- Use server-side pagination for large tables

#### Search Not Working
- Verify search fields exist in the table
- Check for special characters in search query
- Ensure proper URL encoding

### Debug Mode
Enable detailed logging by checking the Google Apps Script logs:
1. Open Google Apps Script editor
2. Go to Executions tab
3. Check execution logs for detailed information

## Support

For issues or questions:
1. Check the test suite results
2. Review Google Apps Script execution logs
3. Verify API parameters and response format
4. Test with the health check endpoint