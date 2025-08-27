# Google Apps Script Comprehensive Logging Documentation

## Overview

The Google Apps Script has been enhanced with comprehensive logging capabilities to improve debugging, monitoring, and troubleshooting. This document explains the logging features and how to use them effectively.

## Logging Features

### 1. Structured Logging System

The logging system provides structured, contextual logging with different levels:

- **DEBUG**: Detailed information for debugging
- **INFO**: General information about operations
- **WARN**: Warning messages for potential issues
- **ERROR**: Error messages with stack traces

### 2. Performance Tracking

All major operations are tracked for performance metrics:

- Request processing time
- Individual operation duration
- Database query timing
- Authentication processing time

### 3. Request Tracking

Each request gets a unique ID for tracking throughout the system:

- Request ID generation
- Parameter logging (with sensitive data filtering)
- Response tracking
- Error correlation

### 4. Security Logging

Authentication and security events are logged:

- Login attempts (successful and failed)
- Token validation
- Permission checks
- Sensitive data filtering

## Logging Configuration

### Current Configuration

```javascript
const CONFIG = {
  ENABLE_DETAILED_LOGGING: true,
  LOG_LEVEL: "DEBUG",
};
```

### Adjusting Log Levels

You can adjust logging by calling the configuration function:

```javascript
// Enable detailed logging with DEBUG level
configureLogging(true, "DEBUG");

// Reduce logging to INFO level only
configureLogging(true, "INFO");

// Disable logging completely
configureLogging(false);
```

## Log Message Structure

### Standard Log Format

```
[2024-01-27T10:30:45.123Z] DEBUG: Request parameters received (Context: REQUEST)
Debug Data: {
  "table": "Materials",
  "operation": "list",
  "token": "***FILTERED***"
}
```

### Performance Log Format

```
[2024-01-27T10:30:45.456Z] INFO: Performance: List Materials completed in 125ms (Context: PERFORMANCE)
Info Data: {
  "operation": "List Materials",
  "duration_ms": 125,
  "start_time": "2024-01-27T10:30:45.331Z",
  "end_time": "2024-01-27T10:30:45.456Z",
  "itemCount": 5,
  "table": "Materials"
}
```

## Logging Contexts

### Request Processing

- **REQUEST_START**: Beginning of request processing
- **REQUEST_VALIDATION**: Parameter validation
- **TOKEN_VALIDATION**: API token verification
- **ROUTING**: Action routing decisions
- **REQUEST_COMPLETE**: Successful request completion
- **REQUEST_ERROR**: Request processing errors

### CRUD Operations

- **CRUD_START**: Beginning of CRUD operation
- **CRUD_PARAMS**: CRUD operation parameters
- **CRUD_OPERATION**: Specific operation execution
- **CRUD_COMPLETE**: Successful CRUD completion

### Authentication

- **AUTH_START**: Authentication process start
- **AUTH_ATTEMPT**: Login attempt details
- **AUTH_SUCCESS**: Successful authentication
- **AUTH_FAILURE**: Failed authentication
- **AUTH_VALIDATION**: Parameter validation

### Performance Tracking

- **PERFORMANCE**: Operation timing and metrics

## Viewing Logs

### Google Apps Script Console

1. Open Google Apps Script editor
2. Go to "Executions" tab
3. Click on any execution to see detailed logs
4. Use the search functionality to filter logs

### Log Filtering

Logs can be filtered by:

- **Context**: Filter by operation type (e.g., "AUTH", "CRUD")
- **Level**: Filter by log level (DEBUG, INFO, WARN, ERROR)
- **Time Range**: Filter by execution time
- **Request ID**: Track specific requests

## Common Log Patterns

### Successful Request Flow

```
[INFO] Starting request processing (Context: REQUEST_START)
[DEBUG] Request parameters received (Context: INITIAL_PARAMS)
[INFO] API token validation successful (Context: TOKEN_VALIDATION)
[INFO] Routing to action handler (Context: ROUTING)
[INFO] Starting CRUD operation (Context: CRUD_START)
[INFO] Materials data prepared successfully (Context: LIST_MATERIALS)
[INFO] Performance: List Materials completed in 125ms (Context: PERFORMANCE)
[INFO] Request processing completed successfully (Context: REQUEST_COMPLETE)
```

### Authentication Flow

```
[INFO] Starting authentication process (Context: AUTH_START)
[INFO] Authentication attempt (Context: AUTH_ATTEMPT)
[INFO] Performance: Credential Validation completed in 15ms (Context: PERFORMANCE)
[INFO] Performance: Token Generation completed in 5ms (Context: PERFORMANCE)
[INFO] Authentication successful (Context: AUTH_SUCCESS)
[INFO] Performance: Complete Authentication completed in 45ms (Context: PERFORMANCE)
```

### Error Handling

```
[ERROR] API token validation failed (Context: TOKEN_VALIDATION)
[ERROR] Creating error response (Context: ERROR_RESPONSE)
[DEBUG] Error response structure created (Context: ERROR_RESPONSE)
```

## Troubleshooting with Logs

### Common Issues and Log Patterns

#### 1. Authentication Failures

**Look for:**

```
[ERROR] Authentication failed: missing email parameter (Context: AUTH_VALIDATION)
[WARN] Authentication failed: invalid credentials (Context: AUTH_FAILURE)
```

**Solution:** Check credentials and ensure all required parameters are provided.

#### 2. API Token Issues

**Look for:**

```
[ERROR] API token validation failed (Context: TOKEN_VALIDATION)
```

**Solution:** Verify the API token matches the expected value.

#### 3. CRUD Operation Failures

**Look for:**

```
[ERROR] Missing required CRUD parameters (Context: CRUD_VALIDATION)
[ERROR] CRUD operation failed (Context: CRUD_HANDLER)
```

**Solution:** Check that all required parameters (table, operation) are provided.

#### 4. Performance Issues

**Look for:**

```
[INFO] Performance: Complete Request completed in 5000ms (Context: PERFORMANCE)
```

**Solution:** If requests take longer than 3000ms, investigate specific operations.

## Performance Monitoring

### Key Metrics to Monitor

1. **Request Duration**: Total time for request processing
2. **Authentication Time**: Time for credential validation
3. **CRUD Operation Time**: Time for database operations
4. **Token Validation Time**: Time for security checks

### Performance Thresholds

- **Good**: < 500ms total request time
- **Acceptable**: 500ms - 2000ms
- **Slow**: 2000ms - 5000ms
- **Critical**: > 5000ms

### Performance Optimization Tips

1. Monitor authentication performance
2. Track CRUD operation timing
3. Identify slow operations
4. Optimize data processing

## Security Considerations

### Sensitive Data Filtering

The logging system automatically filters sensitive information:

- Passwords are replaced with `***FILTERED***`
- API tokens are masked in parameter logs
- JWT secrets are never logged

### Security Event Logging

All security-related events are logged:

- Authentication attempts
- Token validation failures
- Permission checks
- Unauthorized access attempts

## Maintenance and Monitoring

### Regular Log Review

1. **Daily**: Check for error patterns
2. **Weekly**: Review performance trends
3. **Monthly**: Analyze usage patterns

### Log Retention

Google Apps Script automatically manages log retention:

- Execution logs are kept for 30 days
- Console logs are available during execution
- Consider exporting important logs for long-term storage

### Alerting

Set up monitoring for:

- High error rates
- Slow response times
- Authentication failures
- Unusual usage patterns

## Advanced Usage

### Custom Logging

You can add custom log messages in your code:

```javascript
logMessage(
  "INFO",
  "Custom operation started",
  { customData: "value" },
  "CUSTOM"
);
```

### Performance Tracking

Track custom operations:

```javascript
const startTime = Date.now();
// ... your operation ...
const endTime = Date.now();
logPerformance("Custom Operation", startTime, endTime, {
  additionalData: "value",
});
```

### Error Logging

Log custom errors:

```javascript
try {
  // ... your code ...
} catch (error) {
  logError(error, "CUSTOM_CONTEXT", { additionalInfo: "value" });
}
```

## System Status and Diagnostics

### Get System Status

Call the system status function to get current configuration:

```javascript
const status = getSystemStatus();
```

This returns:

- Current configuration
- Runtime information
- Available endpoints
- Performance metrics

### Health Checks

The logging system includes built-in health checks:

- Configuration validation
- Performance monitoring
- Error rate tracking
- System resource usage

## Best Practices

### 1. Log Level Usage

- **DEBUG**: Use for detailed debugging information
- **INFO**: Use for important business events
- **WARN**: Use for recoverable errors or unusual conditions
- **ERROR**: Use for serious errors that need attention

### 2. Context Usage

Always provide meaningful context:

- Use descriptive context names
- Group related operations
- Include relevant identifiers

### 3. Performance Logging

- Log start and end times for major operations
- Include relevant metrics (item counts, data sizes)
- Track user-facing operations

### 4. Error Handling

- Always log errors with context
- Include stack traces for debugging
- Provide actionable error messages

### 5. Security

- Never log sensitive data
- Use filtered logging for user input
- Log security events for audit trails

## Conclusion

The comprehensive logging system provides detailed insights into the Google Apps Script's operation, making it easier to:

- Debug issues quickly
- Monitor performance
- Track security events
- Maintain system health

Use the logging information to proactively identify and resolve issues before they impact users.
