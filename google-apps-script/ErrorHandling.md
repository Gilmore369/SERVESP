# Error Handling and Logging System

## Overview
The consolidated Google Apps Script backend implements a lightweight but comprehensive error handling and logging system that meets requirements 1.4, 7.1, 7.2, and 7.3.

## Error Classification System

### Error Types
The system classifies errors into the following categories:

1. **Client Errors (4xx)**
   - `400 Bad Request`: Missing or invalid parameters
   - `401 Unauthorized`: Invalid API token or authentication failure
   - `403 Forbidden`: Insufficient permissions
   - `404 Not Found`: Resource not found

2. **Server Errors (5xx)**
   - `500 Internal Server Error`: Unexpected server errors
   - `503 Service Unavailable`: System maintenance or overload

### Error Response Format
All errors follow a standardized JSON format:

```json
{
  "ok": false,
  "success": false,
  "error": true,
  "message": "Human-readable error message",
  "status": 400,
  "timestamp": "2025-08-28T10:30:00.000Z",
  "request_id": "req_abc123"
}
```

## Logging System

### Log Levels
The system supports four log levels with configurable filtering:

- **DEBUG**: Detailed information for debugging
- **INFO**: General information about system operation
- **WARN**: Warning messages for non-critical issues
- **ERROR**: Error messages for failures

### Log Configuration
Logging is controlled through the CONFIG object:

```javascript
const CONFIG = {
  ENABLE_LOGGING: true,
  LOG_LEVEL: 'INFO' // Only logs at INFO level and above
};
```

### Log Format
Each log entry includes:
- Timestamp (ISO format)
- Log level
- Message
- Optional context identifier
- Optional structured data

Example log output:
```
[2025-08-28T10:30:00.000Z] INFO: Request completed successfully in 150ms (Context: req_abc123)
```

## Performance Considerations

### Lightweight Implementation
The logging system is designed to minimize performance impact:

1. **Conditional Logging**: Logs are only generated if enabled and meet the configured level
2. **Minimal Overhead**: Simple string formatting without complex processing
3. **No External Dependencies**: Uses only built-in Google Apps Script functions
4. **Efficient Data Structures**: Minimal object creation for log entries

### Memory Management
- Log data is not persisted to avoid memory leaks
- Structured data is only serialized when actually logged
- Request IDs are generated efficiently using timestamps and random values

## Error Handling Patterns

### Request-Level Error Handling
Every request is wrapped in a try-catch block with:
- Performance timing
- Request ID generation
- Standardized error responses
- Automatic logging of failures

### Operation-Level Error Handling
Individual operations (CRUD, auth, etc.) implement:
- Input validation with specific error messages
- Business logic error handling
- Resource-specific error responses
- Context-aware logging

### Graceful Degradation
The system implements graceful degradation:
- Falls back to mock data when Google Sheets is unavailable
- Continues operation even if logging fails
- Provides meaningful error messages for all failure scenarios

## User-Friendly Error Messages

### Client-Facing Messages
Error messages are designed to be:
- Clear and actionable
- Free of technical jargon
- Specific enough to help users resolve issues
- Consistent in tone and format

### Examples
- Instead of: "Parameter validation failed"
- Use: "Missing required parameter: email"

- Instead of: "Database connection error"
- Use: "Unable to retrieve data. Please try again."

## Security Considerations

### Information Disclosure Prevention
The error handling system prevents information disclosure by:
- Not exposing internal system details in error messages
- Filtering sensitive data from logs
- Using generic messages for authentication failures
- Avoiding stack traces in client responses

### Audit Trail
All authentication attempts and failures are logged with:
- User identification (when available)
- Timestamp
- Request context
- Failure reason (for internal use)

## Implementation Examples

### Basic Error Handling
```javascript
function handleOperation(params, requestId) {
  try {
    // Validate input
    if (!params.required_field) {
      return createErrorResponse("Missing required parameter: required_field", 400, requestId);
    }
    
    // Perform operation
    const result = performOperation(params);
    
    logMessage('INFO', 'Operation completed successfully', null, requestId);
    return createSuccessResponse(result, requestId);
    
  } catch (error) {
    logMessage('ERROR', `Operation failed: ${error.message}`, { requestId: requestId });
    return createErrorResponse("Operation failed. Please try again.", 500, requestId);
  }
}
```

### Logging with Context
```javascript
function processRequest(params, requestId) {
  logMessage('INFO', 'Starting request processing', { action: params.action }, requestId);
  
  // Process request...
  
  logMessage('INFO', 'Request processing completed', { 
    duration: Date.now() - startTime,
    success: true 
  }, requestId);
}
```

## Monitoring and Maintenance

### Log Analysis
The logging system supports operational monitoring by:
- Providing structured log data for analysis
- Including performance metrics (execution time)
- Tracking request patterns and error rates
- Enabling troubleshooting with request IDs

### Maintenance Tasks
Regular maintenance should include:
- Reviewing error patterns and frequencies
- Adjusting log levels based on operational needs
- Monitoring system performance impact
- Updating error messages based on user feedback

## Configuration Management

### Properties Service Integration
The system uses Google Apps Script Properties Service for configuration:
- API tokens and secrets are stored securely
- Configuration can be updated without code changes
- Environment-specific settings are supported
- Fallback values ensure system stability

### Runtime Configuration
Configuration is loaded at runtime with fallbacks:
```javascript
const CONFIG = {
  get API_TOKEN() {
    return PropertiesService.getScriptProperties().getProperty('API_TOKEN') || 'fallback-token';
  }
};
```

This approach ensures the system remains operational even with incomplete configuration while maintaining security best practices.