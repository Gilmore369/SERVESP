# Implementation Plan

- [x] 1. Backup and prepare Google Apps Script environment

  - Create backup of current Google Apps Script code
  - Verify access to the Google Apps Script project
  - Confirm deployment URL matches frontend configuration
  - _Requirements: 4.1, 4.2_

- [x] 2. Implement core CRUD handler functions

  - [x] 2.1 Create main CRUD dispatcher function

    - Write `handleCRUD(data)` function that routes to specific operations

    - Add validation for required parameters (table, operation)
    - Implement error handling for invalid operations
    - _Requirements: 2.1, 2.2, 5.2_

  - [x] 2.2 Implement list operation handler

    - Write `handleList(table, data)` function
    - Add mock data for Materials table with 5 sample construction materials
    - Include all required fields (id, sku, descripcion, categoria, unidad, costo_ref, stock_actual, stock_minimo, proveedor_principal, activo, timestamps)
    - Return empty array for other tables as fallback
    - _Requirements: 2.1, 1.2_

  - [x] 2.3 Implement get operation handler

    - Write `handleGet(table, data)` function
    - Add ID parameter validation
    - Return mock object for testing purposes
    - Include proper error handling for missing ID
    - _Requirements: 2.1, 5.2_

  - [x] 2.4 Implement create operation handler

    - Write `handleCreate(table, data)` function
    - Generate unique ID for new items
    - Add creation and update timestamps
    - Return created item with generated fields
    - _Requirements: 2.2_

  - [x] 2.5 Implement update operation handler

    - Write `handleUpdate(table, data)` function
    - Validate required ID parameter
    - Update timestamp on modifications
    - Return updated item data
    - _Requirements: 2.3_

  - [x] 2.6 Implement delete operation handler

    - Write `handleDelete(table, data)` function
    - Validate required ID parameter
    - Return success confirmation message
    - Add proper error handling
    - _Requirements: 2.4_

- [x] 3. Implement authentication system

  - [x] 3.1 Create authentication handler

    - Write `handleAuth(data)` function with email/password validation
    - Add test user credentials (admin@servesplatform.com / admin123)
    - Generate mock JWT token for successful authentication
    - Return user object with role and permissions
    - _Requirements: 3.1, 3.2_

  - [x] 3.2 Implement user info endpoint

    - Write `handleWhoAmI(data)` function
    - Return mock admin user object
    - Remove JWT dependency for simplicity
    - Include user role and status information
    - _Requirements: 3.1_

- [x] 4. Enhance error handling and robustness


  - [x] 4.1 Improve main request handler

    - Update `handleRequest(e)` with comprehensive error catching
    - Add parameter parsing and validation

    - Implement proper API token validation with informative error messages
    - Add request routing with fallback for invalid actions
    - _Requirements: 5.1, 5.2, 4.3_

  - [x] 4.2 Standardize response formatting

    - Update `createErrorResponse(message, status)` with consistent structure
    - Update `createSuccessResponse(data)` with timestamp and proper JSON formatting
    - Ensure all responses include proper CORS headers
    - Add status codes and timestamps to all responses
    - _Requirements: 5.1, 5.3_

- [x] 5. Configure and deploy the complete solution




  - [x] 5.1 Update Google Apps Script configuration



    - Replace entire Code.gs content with complete implementation
    - Set hardcoded CONFIG object with correct values

    - Remove dependency on Script Properties for reliability
    - Add initialization function as backup option
    - _Requirements: 4.1, 4.2_



  - [ ] 5.2 Deploy and test the updated script
    - Save the updated Google Apps Script code
    - Deploy as web application with proper permissions



    - Verify the deployment URL remains unchanged


    - Test API endpoints directly in browser
    - _Requirements: 4.1, 4.2_

- [ ] 6. Validate frontend integration

  - [x] 6.1 Test materials page functionality



    - Navigate to /materiales page in the frontend application
    - Verify materials load without "Reintentar cargar materiales" error

    - Confirm all 5 mock materials display correctly

    - Check that material data includes all required fields
    - _Requirements: 1.1, 1.2_

  - [ ] 6.2 Test API client communication
    - Verify API client successfully connects to Google Apps Script
    - Test CRUD operations through frontend interface
    - Confirm error messages are user-friendly when issues occur
    - Validate authentication flow works with test credentials
    - _Requirements: 1.3, 3.1, 3.2_

- [x] 7. Create diagnostic and monitoring tools



  - [x] 7.1 Implement API diagnostic script


    - Create browser console script to test API endpoints directly
    - Add environment variable verification script
    - Include connection testing and response validation
    - Provide troubleshooting steps for common issues
    - _Requirements: 4.3, 5.1_

  - [x] 7.2 Add comprehensive logging


    - Add console.log statements for debugging in Google Apps Script
    - Include request parameter logging for troubleshooting
    - Add error logging with stack traces
    - Implement request/response timing logs
    - _Requirements: 5.1, 5.3_
