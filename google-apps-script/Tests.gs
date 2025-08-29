/**
 * Google Apps Script Unit Tests
 * Comprehensive tests for all CRUD operations, authentication, and validation
 * Requirements: 8.1
 */

/**
 * Main test runner function - call this to run all tests
 */
function runTests() {
  // Clear previous results
  testResults = {
    suites: [],
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    startTime: null,
    endTime: null,
    duration: 0
  };

  // Define all test suites
  testRequestHandling();
  testAuthentication();
  testCRUDOperations();
  testValidationFunctions();
  testErrorHandling();
  testUtilityFunctions();
  testBatchOperations();
  testHealthCheck();

  // Run all tests
  return runAllTests();
}

/**
 * Test Suite: Request Handling
 */
function testRequestHandling() {
  describe('Request Handling', 'Tests for main request handling functions', () => {
    
    it('should handle GET requests correctly', () => {
      const mockRequest = TestMocks.createMockRequest({
        action: 'health'
      });
      
      const response = handleRequest(mockRequest);
      const content = JSON.parse(response.getContent());
      
      assert.isNotNull(response, 'Response should not be null');
      assert.equals(content.ok || content.success, true, 'Response should be successful');
      assert.contains(content, 'status', 'Health check should contain status');
    });

    it('should handle POST requests correctly', () => {
      const mockRequest = TestMocks.createMockPostRequest({
        action: 'auth',
        email: 'admin@servesplatform.com',
        password: 'admin123'
      });
      
      const response = handleRequest(mockRequest);
      const content = JSON.parse(response.getContent());
      
      assert.isNotNull(response, 'Response should not be null');
      assert.equals(content.ok || content.success, true, 'Authentication should be successful');
      assert.contains(content.data || content, 'token', 'Response should contain token');
    });

    it('should reject requests with invalid API token', () => {
      const mockRequest = TestMocks.createMockRequest({
        token: 'invalid-token',
        action: 'health'
      });
      
      const response = handleRequest(mockRequest);
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Request should fail with invalid token');
      assert.contains(content.message || content.error, 'token', 'Error should mention token');
    });

    it('should handle missing parameters gracefully', () => {
      const mockRequest = {
        parameter: {
          token: CONFIG.API_TOKEN
          // Missing action parameter
        }
      };
      
      const response = handleRequest(mockRequest);
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Request should fail with missing action');
    });

    it('should generate proper CORS response', () => {
      const response = createCORSResponse();
      const content = JSON.parse(response.getContent());
      
      assert.isNotNull(response, 'CORS response should not be null');
      assert.equals(content.ok || content.success, true, 'CORS response should be successful');
      assert.contains(content, 'methods', 'CORS response should contain allowed methods');
    });
  });
}

/**
 * Test Suite: Authentication
 */
function testAuthentication() {
  describe('Authentication', 'Tests for authentication and authorization logic', () => {
    
    it('should authenticate valid admin credentials', () => {
      const params = {
        email: 'admin@servesplatform.com',
        password: 'admin123',
        token: CONFIG.API_TOKEN
      };
      
      const response = handleAuth(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'Authentication should succeed');
      assert.contains(content.data || content, 'user', 'Response should contain user data');
      assert.contains(content.data || content, 'token', 'Response should contain JWT token');
      
      const userData = content.data?.user || content.user;
      assert.equals(userData.email, 'admin@servesplatform.com', 'User email should match');
      assert.equals(userData.role, 'admin', 'User role should be admin');
    });

    it('should reject invalid credentials', () => {
      const params = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
        token: CONFIG.API_TOKEN
      };
      
      const response = handleAuth(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Authentication should fail');
      assert.contains(content.message || content.error, 'Invalid', 'Error should mention invalid credentials');
    });

    it('should reject missing email parameter', () => {
      const params = {
        password: 'admin123',
        token: CONFIG.API_TOKEN
      };
      
      const response = handleAuth(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Authentication should fail without email');
      assert.contains(content.message || content.error, 'Missing', 'Error should mention missing parameters');
    });

    it('should reject missing password parameter', () => {
      const params = {
        email: 'admin@servesplatform.com',
        token: CONFIG.API_TOKEN
      };
      
      const response = handleAuth(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Authentication should fail without password');
      assert.contains(content.message || content.error, 'Missing', 'Error should mention missing parameters');
    });

    it('should generate valid JWT tokens', () => {
      const mockUser = TestMocks.createMockUser();
      const token = generateJWT(mockUser);
      
      assert.isNotNull(token, 'JWT token should not be null');
      assert.isTrue(token.length > 0, 'JWT token should not be empty');
      assert.equals(token.split('.').length, 3, 'JWT should have 3 parts separated by dots');
    });

    it('should handle whoami requests correctly', () => {
      const params = {
        token: CONFIG.API_TOKEN
      };
      
      const response = handleWhoAmI(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'WhoAmI should succeed');
      assert.contains(content.data || content, 'id', 'Response should contain user ID');
      assert.contains(content.data || content, 'email', 'Response should contain user email');
      assert.contains(content.data || content, 'role', 'Response should contain user role');
    });
  });
}

/**
 * Test Suite: CRUD Operations
 */
function testCRUDOperations() {
  describe('CRUD Operations', 'Tests for Create, Read, Update, Delete operations', () => {
    
    it('should handle list operations correctly', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        table: 'materials',
        operation: 'list',
        page: 1,
        limit: 10
      };
      
      const response = handleOptimizedCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'List operation should succeed');
      assert.contains(content.data || content, 'data', 'Response should contain data array');
      assert.contains(content.data || content, 'pagination', 'Response should contain pagination info');
      
      const responseData = content.data || content;
      assert.isTrue(Array.isArray(responseData.data), 'Data should be an array');
      assert.isNotNull(responseData.pagination, 'Pagination should not be null');
    });

    it('should handle get operations correctly', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        table: 'materials',
        operation: 'get',
        id: 'test-id-123'
      };
      
      const response = handleOptimizedCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'Get operation should succeed');
      assert.contains(content.data || content, 'id', 'Response should contain item ID');
      
      const item = content.data || content;
      assert.equals(item.id, 'test-id-123', 'Returned item should have correct ID');
    });

    it('should handle create operations correctly', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        table: 'materials',
        operation: 'create',
        sku: 'TEST001',
        descripcion: 'Test Material',
        categoria: 'Test Category',
        unidad: 'Unit',
        costo_ref: 10.00
      };
      
      const response = handleOptimizedCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'Create operation should succeed');
      assert.contains(content.data || content, 'id', 'Response should contain generated ID');
      assert.contains(content.data || content, 'created_at', 'Response should contain creation timestamp');
      
      const item = content.data || content;
      assert.equals(item.sku, 'TEST001', 'Created item should have correct SKU');
      assert.equals(item.descripcion, 'Test Material', 'Created item should have correct description');
    });

    it('should handle update operations correctly', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        table: 'materials',
        operation: 'update',
        id: 'test-id-123',
        descripcion: 'Updated Test Material',
        costo_ref: 15.00
      };
      
      const response = handleOptimizedCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'Update operation should succeed');
      assert.contains(content.data || content, 'updated_at', 'Response should contain update timestamp');
      
      const item = content.data || content;
      assert.equals(item.id, 'test-id-123', 'Updated item should have correct ID');
      assert.equals(item.descripcion, 'Updated Test Material', 'Updated item should have new description');
    });

    it('should handle delete operations correctly', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        table: 'materials',
        operation: 'delete',
        id: 'test-id-123'
      };
      
      const response = handleOptimizedCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'Delete operation should succeed');
      assert.contains(content.data || content, 'deleted_id', 'Response should contain deleted ID');
      
      const result = content.data || content;
      assert.equals(result.deleted_id, 'test-id-123', 'Deleted ID should match requested ID');
    });

    it('should reject operations with invalid table names', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        table: 'invalid_table',
        operation: 'list'
      };
      
      const response = handleOptimizedCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Operation should fail with invalid table');
      assert.contains(content.message || content.error, 'Invalid table', 'Error should mention invalid table');
    });

    it('should reject operations missing required parameters', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        table: 'materials'
        // Missing operation parameter
      };
      
      const response = handleOptimizedCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Operation should fail with missing parameters');
      assert.contains(content.message || content.error, 'Missing', 'Error should mention missing parameters');
    });
  });
}

/**
 * Test Suite: Validation Functions
 */
function testValidationFunctions() {
  describe('Validation Functions', 'Tests for data validation and business rules', () => {
    
    it('should validate table names correctly', () => {
      assert.isTrue(isValidTable('materials'), 'materials should be valid table');
      assert.isTrue(isValidTable('users'), 'users should be valid table');
      assert.isTrue(isValidTable('projects'), 'projects should be valid table');
      assert.isFalse(isValidTable('invalid_table'), 'invalid_table should not be valid');
      assert.isFalse(isValidTable(''), 'empty string should not be valid table');
      assert.isFalse(isValidTable(null), 'null should not be valid table');
    });

    it('should parse filters correctly', () => {
      const filtersString = 'category:Construction,status:active,price:>100';
      const filters = parseFilters(filtersString);
      
      assert.isNotNull(filters, 'Parsed filters should not be null');
      assert.equals(typeof filters, 'object', 'Parsed filters should be an object');
      assert.contains(filters, 'category', 'Filters should contain category');
      assert.contains(filters, 'status', 'Filters should contain status');
      assert.contains(filters, 'price', 'Filters should contain price');
    });

    it('should handle empty filter strings', () => {
      const filters = parseFilters('');
      assert.isNotNull(filters, 'Empty filters should return empty object');
      assert.equals(Object.keys(filters).length, 0, 'Empty filters should have no keys');
    });

    it('should handle null filter strings', () => {
      const filters = parseFilters(null);
      assert.isNotNull(filters, 'Null filters should return empty object');
      assert.equals(Object.keys(filters).length, 0, 'Null filters should have no keys');
    });

    it('should generate valid request IDs', () => {
      const requestId1 = generateRequestId();
      const requestId2 = generateRequestId();
      
      assert.isNotNull(requestId1, 'Request ID should not be null');
      assert.isNotNull(requestId2, 'Request ID should not be null');
      assert.isTrue(requestId1.length > 0, 'Request ID should not be empty');
      assert.isTrue(requestId2.length > 0, 'Request ID should not be empty');
      assert.isFalse(requestId1 === requestId2, 'Request IDs should be unique');
    });
  });
}

/**
 * Test Suite: Error Handling
 */
function testErrorHandling() {
  describe('Error Handling', 'Tests for error handling and validation functions', () => {
    
    it('should create proper error responses', () => {
      const errorResponse = createErrorResponse('Test error message', 400, 'test-request-id');
      const content = JSON.parse(errorResponse.getContent());
      
      assert.isFalse(content.ok || content.success, 'Error response should not be successful');
      assert.contains(content, 'message', 'Error response should contain message');
      assert.contains(content.message || content.error, 'Test error message', 'Error message should match');
    });

    it('should create proper success responses', () => {
      const testData = { test: 'data', value: 123 };
      const successResponse = createSuccessResponse(testData, 'test-request-id');
      const content = JSON.parse(successResponse.getContent());
      
      assert.equals(content.ok || content.success, true, 'Success response should be successful');
      assert.contains(content, 'data', 'Success response should contain data');
      assert.deepEquals(content.data, testData, 'Response data should match input data');
    });

    it('should handle invalid JSON in POST requests', () => {
      const mockRequest = {
        parameter: {
          token: CONFIG.API_TOKEN,
          action: 'crud'
        },
        postData: {
          contents: 'invalid json content'
        }
      };
      
      // This should not throw an error, but handle it gracefully
      const response = handleRequest(mockRequest);
      const content = JSON.parse(response.getContent());
      
      // The request should still be processed, just without the POST data
      assert.isNotNull(response, 'Response should not be null even with invalid JSON');
    });

    it('should handle missing request parameters', () => {
      const response = handleRequest(null);
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Request should fail with null parameters');
    });

    it('should handle exceptions in request processing', () => {
      // Test with malformed request that should cause an exception
      const mockRequest = {
        parameter: {
          token: CONFIG.API_TOKEN,
          action: 'crud',
          table: 'materials',
          operation: 'invalid_operation'
        }
      };
      
      const response = handleRequest(mockRequest);
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Request should fail with invalid operation');
      assert.contains(content.message || content.error, 'Invalid operation', 'Error should mention invalid operation');
    });
  });
}

/**
 * Test Suite: Utility Functions
 */
function testUtilityFunctions() {
  describe('Utility Functions', 'Tests for utility and helper functions', () => {
    
    it('should apply sorting correctly', () => {
      const testData = [
        { id: '3', name: 'Charlie', value: 30 },
        { id: '1', name: 'Alice', value: 10 },
        { id: '2', name: 'Bob', value: 20 }
      ];
      
      const sortedAsc = applySorting(testData, 'name', 'asc');
      assert.equals(sortedAsc[0].name, 'Alice', 'First item should be Alice when sorted by name ascending');
      assert.equals(sortedAsc[2].name, 'Charlie', 'Last item should be Charlie when sorted by name ascending');
      
      const sortedDesc = applySorting(testData, 'value', 'desc');
      assert.equals(sortedDesc[0].value, 30, 'First item should have value 30 when sorted by value descending');
      assert.equals(sortedDesc[2].value, 10, 'Last item should have value 10 when sorted by value descending');
    });

    it('should apply filters correctly', () => {
      const testData = [
        { id: '1', category: 'A', status: 'active', price: 100 },
        { id: '2', category: 'B', status: 'inactive', price: 200 },
        { id: '3', category: 'A', status: 'active', price: 150 }
      ];
      
      const filters = { category: 'A', status: 'active' };
      const filtered = applyFiltersAndSearch(testData, filters, '');
      
      assert.equals(filtered.length, 2, 'Should return 2 items matching filters');
      assert.equals(filtered[0].category, 'A', 'Filtered items should have category A');
      assert.equals(filtered[1].category, 'A', 'Filtered items should have category A');
    });

    it('should apply search correctly', () => {
      const testData = [
        { id: '1', name: 'Apple Product', description: 'Great apple device' },
        { id: '2', name: 'Orange Product', description: 'Citrus fruit device' },
        { id: '3', name: 'Banana Product', description: 'Yellow fruit device' }
      ];
      
      const searchResults = applyFiltersAndSearch(testData, {}, 'apple');
      
      assert.equals(searchResults.length, 1, 'Should return 1 item matching search');
      assert.contains(searchResults[0].name.toLowerCase(), 'apple', 'Result should contain apple');
    });

    it('should handle empty datasets gracefully', () => {
      const emptyResult = createEmptyPaginationResult(1, 10);
      
      assert.isNotNull(emptyResult, 'Empty result should not be null');
      assert.equals(emptyResult.data.length, 0, 'Empty result should have no data');
      assert.equals(emptyResult.pagination.total_records, 0, 'Empty result should have 0 total records');
    });
  });
}

/**
 * Test Suite: Batch Operations
 */
function testBatchOperations() {
  describe('Batch Operations', 'Tests for batch CRUD operations', () => {
    
    it('should handle batch operations correctly', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        operations: [
          {
            table: 'materials',
            operation: 'create',
            sku: 'BATCH001',
            descripcion: 'Batch Test Material 1'
          },
          {
            table: 'materials',
            operation: 'create',
            sku: 'BATCH002',
            descripcion: 'Batch Test Material 2'
          }
        ]
      };
      
      const response = handleBatchCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'Batch operation should succeed');
      assert.contains(content.data || content, 'results', 'Response should contain results array');
      
      const responseData = content.data || content;
      assert.equals(responseData.total_operations, 2, 'Should process 2 operations');
      assert.isTrue(responseData.successful_operations >= 0, 'Should track successful operations');
    });

    it('should reject batch operations exceeding maximum size', () => {
      const operations = [];
      for (let i = 0; i < CONFIG.MAX_BATCH_SIZE + 1; i++) {
        operations.push({
          table: 'materials',
          operation: 'create',
          sku: `BATCH${i}`,
          descripcion: `Batch Test Material ${i}`
        });
      }
      
      const params = {
        token: CONFIG.API_TOKEN,
        operations: operations
      };
      
      const response = handleBatchCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.isFalse(content.ok || content.success, 'Batch operation should fail when exceeding max size');
      assert.contains(content.message || content.error, 'maximum', 'Error should mention maximum size');
    });

    it('should handle empty batch operations', () => {
      const params = {
        token: CONFIG.API_TOKEN,
        operations: []
      };
      
      const response = handleBatchCRUD(params, 'test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'Empty batch should succeed');
      
      const responseData = content.data || content;
      assert.equals(responseData.total_operations, 0, 'Should process 0 operations');
    });
  });
}

/**
 * Test Suite: Health Check
 */
function testHealthCheck() {
  describe('Health Check', 'Tests for system health check functionality', () => {
    
    it('should return healthy status', () => {
      const response = handleHealthCheck('test-request-id');
      const content = JSON.parse(response.getContent());
      
      assert.equals(content.ok || content.success, true, 'Health check should succeed');
      assert.contains(content.data || content, 'status', 'Response should contain status');
      
      const healthData = content.data || content;
      assert.equals(healthData.status, 'healthy', 'Status should be healthy');
      assert.contains(healthData, 'timestamp', 'Response should contain timestamp');
      assert.contains(healthData, 'version', 'Response should contain version');
    });

    it('should include system configuration in health check', () => {
      const response = handleHealthCheck('test-request-id');
      const content = JSON.parse(response.getContent());
      
      const healthData = content.data || content;
      assert.contains(healthData, 'config', 'Health check should contain config');
      assert.contains(healthData.config, 'default_page_size', 'Config should contain pagination settings');
    });
  });
}

/**
 * Helper function to run a specific test suite
 */
function runTestSuite(suiteName) {
  // Clear previous results
  testResults = {
    suites: [],
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    startTime: null,
    endTime: null,
    duration: 0
  };

  // Run specific test suite
  switch (suiteName.toLowerCase()) {
    case 'request':
    case 'request_handling':
      testRequestHandling();
      break;
    case 'auth':
    case 'authentication':
      testAuthentication();
      break;
    case 'crud':
    case 'crud_operations':
      testCRUDOperations();
      break;
    case 'validation':
    case 'validation_functions':
      testValidationFunctions();
      break;
    case 'error':
    case 'error_handling':
      testErrorHandling();
      break;
    case 'utility':
    case 'utility_functions':
      testUtilityFunctions();
      break;
    case 'batch':
    case 'batch_operations':
      testBatchOperations();
      break;
    case 'health':
    case 'health_check':
      testHealthCheck();
      break;
    default:
      throw new Error(`Unknown test suite: ${suiteName}`);
  }

  return runAllTests();
}