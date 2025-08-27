# ServesPlatform API Troubleshooting Guide

This guide provides step-by-step troubleshooting for common issues with the ServesPlatform Google Apps Script API.

## Quick Diagnostic Tools

### 1. Browser Console Diagnostic Script
```javascript
// Copy and paste this in browser console (F12)
// Then run: await runFullDiagnostic()
```
Load the script from: `google-apps-script/API_DIAGNOSTIC_SCRIPT.js`

### 2. Environment Verification Script
```javascript
// Copy and paste this in browser console (F12)
// Then run: await verifyEnvironment()
```
Load the script from: `google-apps-script/ENVIRONMENT_VERIFICATION_SCRIPT.js`

## Common Issues and Solutions

### Issue 1: "Reintentar cargar materiales" Error

**Symptoms:**
- Materials page shows "Reintentar cargar materiales" button
- Console shows API connection errors
- Materials list is empty or not loading

**Diagnosis Steps:**
1. Open browser console (F12)
2. Navigate to `/materiales` page
3. Look for error messages in console
4. Run diagnostic script: `await runFullDiagnostic()`

**Common Causes & Solutions:**

#### A. Invalid API URL
```javascript
// Check current API URL
console.log(process.env.NEXT_PUBLIC_API_URL);

// Should be:
// https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec
```

**Solution:** Update `.env.local` file:
```
NEXT_PUBLIC_API_URL=https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec
```

#### B. Invalid API Token
```javascript
// Check current API token
console.log(process.env.NEXT_PUBLIC_API_TOKEN);

// Should be:
// serves-platform-2024-api-key
```

**Solution:** Update `.env.local` file:
```
NEXT_PUBLIC_API_TOKEN=serves-platform-2024-api-key
```

#### C. Google Apps Script Not Deployed
**Symptoms:** 404 errors or "Script not found"

**Solution:**
1. Open Google Apps Script project
2. Click "Deploy" > "New deployment"
3. Set type to "Web app"
4. Set execute as "Me"
5. Set access to "Anyone"
6. Click "Deploy"

### Issue 2: CORS Errors

**Symptoms:**
- Console shows CORS policy errors
- Requests are blocked by browser
- "Access-Control-Allow-Origin" errors

**Diagnosis:**
```javascript
// Test direct API access
await fetch('https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=serves-platform-2024-api-key&action=whoami')
```

**Solutions:**
1. Ensure Google Apps Script includes CORS headers
2. Use GET requests instead of POST (already implemented)
3. Check that script is deployed with proper permissions

### Issue 3: Authentication Failures

**Symptoms:**
- 401 Unauthorized errors
- "Invalid token" messages
- Cannot access protected endpoints

**Diagnosis Steps:**
```javascript
// Test authentication
await testEndpoint('auth', {
  email: 'admin@servesplatform.com',
  password: 'admin123'
});
```

**Solutions:**
1. Verify API token in environment variables
2. Check that auth function is implemented in Google Apps Script
3. Ensure test credentials are correct

### Issue 4: Google Apps Script Errors

**Symptoms:**
- 500 Internal Server Error
- "Script error" messages
- Unexpected responses

**Diagnosis Steps:**
1. Open Google Apps Script editor
2. Check "Executions" tab for error logs
3. Look for runtime errors or exceptions

**Common Script Issues:**

#### A. Missing Functions
Check that these functions exist in Code.gs:
- `handleRequest(e)`
- `handleCRUD(data)`
- `handleAuth(data)`
- `handleWhoAmI(data)`

#### B. Configuration Issues
Verify CONFIG object in Code.gs:
```javascript
const CONFIG = {
  SHEET_ID: 'your-sheet-id',
  API_TOKEN: 'serves-platform-2024-api-key',
  JWT_SECRET: 'your-jwt-secret',
  ENVIRONMENT: 'development'
};
```

#### C. Permission Issues
1. Go to Google Apps Script project
2. Click "Deploy" > "Manage deployments"
3. Ensure "Execute as" is set to "Me"
4. Ensure "Who has access" is set to "Anyone"

### Issue 5: Network Connectivity Issues

**Symptoms:**
- Timeout errors
- "Network error" messages
- Slow or failed requests

**Diagnosis:**
```javascript
// Test basic connectivity
await quickTest();
```

**Solutions:**
1. Check internet connection
2. Verify firewall settings
3. Test from different network
4. Check if Google services are accessible

### Issue 6: Environment Variable Issues

**Symptoms:**
- Variables showing as "undefined"
- Different values in development vs production
- Missing configuration

**Diagnosis:**
```javascript
// Check all environment variables
await verifyEnvironment();
```

**Solutions:**

#### For Local Development:
Create/update `.env.local`:
```
NEXT_PUBLIC_API_URL=https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec
NEXT_PUBLIC_API_TOKEN=serves-platform-2024-api-key
```

#### For Vercel Deployment:
1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add the required variables

#### For Other Platforms:
Add environment variables according to your platform's documentation.

## Step-by-Step Debugging Process

### 1. Initial Assessment
```javascript
// Run in browser console
await runFullDiagnostic();
```

### 2. Check Environment
```javascript
// Verify configuration
await verifyEnvironment();
```

### 3. Test Individual Components
```javascript
// Test connectivity
await testConnectivity();

// Test authentication
await testAuthentication();

// Test materials CRUD
await testMaterialsCRUD();
```

### 4. Check Google Apps Script
1. Open Google Apps Script project
2. Check "Executions" tab for errors
3. Verify deployment status
4. Test script functions manually

### 5. Verify Frontend Configuration
1. Check `.env.local` file
2. Restart development server
3. Clear browser cache
4. Check network tab in developer tools

## Advanced Troubleshooting

### Enable Detailed Logging
Add this to your Google Apps Script:
```javascript
function debugRequest(e) {
  console.log('Request parameters:', e.parameter);
  console.log('Request method:', e.method);
  console.log('Request headers:', e.headers);
}
```

### Test API Directly
Use this URL in browser to test directly:
```
https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=serves-platform-2024-api-key&action=whoami
```

### Monitor Network Traffic
1. Open browser developer tools (F12)
2. Go to "Network" tab
3. Perform the failing action
4. Check request/response details

## Getting Help

### Information to Collect
When reporting issues, include:
1. Error messages from browser console
2. Results from diagnostic scripts
3. Google Apps Script execution logs
4. Environment configuration (without sensitive data)
5. Steps to reproduce the issue

### Diagnostic Commands
```javascript
// Complete diagnostic
const results = await runFullDiagnostic();
console.log(JSON.stringify(results, null, 2));

// Environment check
const envResults = await verifyEnvironment();
console.log(JSON.stringify(envResults, null, 2));
```

### Log Files to Check
1. Browser console (F12)
2. Google Apps Script > Executions
3. Network tab in developer tools
4. Server logs (if applicable)

## Prevention Tips

### Regular Maintenance
1. Test API endpoints monthly
2. Monitor Google Apps Script quotas
3. Keep environment variables updated
4. Backup Google Apps Script code

### Best Practices
1. Use version control for Google Apps Script
2. Test changes in development first
3. Monitor error rates and response times
4. Keep diagnostic scripts updated

### Monitoring Setup
```javascript
// Add to your application for ongoing monitoring
setInterval(async () => {
  const result = await quickTest();
  if (!result.success) {
    console.error('API health check failed:', result);
  }
}, 300000); // Check every 5 minutes
```