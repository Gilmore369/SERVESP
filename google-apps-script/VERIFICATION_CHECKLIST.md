# Google Apps Script Deployment Verification Checklist

## Pre-Deployment Checklist

### ✅ Code Configuration
- [ ] **CONFIG object has correct values**:
  - `SHEET_ID`: "1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U"
  - `API_TOKEN`: "demo-token-2024"
  - `JWT_SECRET`: "mi-secreto-jwt-super-seguro-2024"
  - `ENVIRONMENT`: "development"

- [ ] **All required functions are present**:
  - `doGet(e)` and `doPost(e)` - Entry points
  - `handleRequest(e)` - Main request handler
  - `handleCRUD(data)` - CRUD dispatcher
  - `handleList()`, `handleGet()`, `handleCreate()`, `handleUpdate()`, `handleDelete()` - CRUD operations
  - `handleAuth(data)` - Authentication
  - `handleWhoAmI(data)` - User info
  - `createSuccessResponse()` and `createErrorResponse()` - Response formatters

- [ ] **Materials mock data is complete** (5 materials with all required fields)

## Deployment Checklist

### ✅ Google Apps Script Setup
- [ ] **Code.gs file updated** with complete implementation
- [ ] **Script saves without errors** (no syntax issues)
- [ ] **Deployed as web application** with correct settings:
  - Execute as: "Me"
  - Who has access: "Anyone"
- [ ] **Deployment URL matches frontend configuration**:
  - Expected: `https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec`

## API Testing Checklist

### ✅ Direct URL Testing
Test these URLs directly in your browser:

1. **whoami endpoint**:
   ```
   https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=demo-token-2024&action=whoami
   ```
   - [ ] Returns JSON with `"ok": true`
   - [ ] Contains admin user data

2. **Materials list endpoint** (CRITICAL):
   ```
   https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=demo-token-2024&action=crud&operation=list&table=Materials
   ```
   - [ ] Returns JSON with `"ok": true`
   - [ ] Contains array of 5 materials
   - [ ] Each material has all required fields (id, sku, descripcion, etc.)

3. **Authentication endpoint**:
   ```
   https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=demo-token-2024&action=auth&email=admin@servesplatform.com&password=admin123
   ```
   - [ ] Returns JSON with `"ok": true`
   - [ ] Contains user object and token

4. **Error handling test**:
   ```
   https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=invalid-token&action=whoami
   ```
   - [ ] Returns JSON with `"ok": false`
   - [ ] Status code 401
   - [ ] Proper error message

### ✅ Using Test Suite
- [ ] **Open `API_TEST_SCRIPT.html`** in browser
- [ ] **Run all tests** - all should pass
- [ ] **Check browser console** for any JavaScript errors

## Frontend Integration Checklist

### ✅ Environment Configuration
- [ ] **`.env.local` file has correct values**:
  - `NEXT_PUBLIC_API_BASE_URL`: matches deployment URL
  - `NEXT_PUBLIC_API_TOKEN`: "demo-token-2024"

### ✅ Frontend Testing
- [ ] **Start development server**: `npm run dev`
- [ ] **Navigate to materials page**: `http://localhost:3000/materiales`
- [ ] **Verify materials load correctly**:
  - [ ] No "Reintentar cargar materiales" error
  - [ ] 5 materials are displayed
  - [ ] Material data shows correctly (name, category, stock, etc.)
- [ ] **Check browser developer tools**:
  - [ ] No API errors in Console
  - [ ] Network tab shows successful API calls (200 status)
  - [ ] API responses contain expected data

### ✅ Authentication Testing
- [ ] **Login page works**: `http://localhost:3000/login`
- [ ] **Test credentials work**:
  - Email: `admin@servesplatform.com`
  - Password: `admin123`
- [ ] **Successful login redirects to dashboard**
- [ ] **User info displays correctly**

## Troubleshooting Guide

### If API tests fail:
1. **Check Google Apps Script logs**:
   - Go to Google Apps Script → Executions tab
   - Look for recent executions and error messages

2. **Verify deployment**:
   - Ensure the script is deployed as a web app
   - Check that permissions are set to "Anyone"

3. **Check configuration**:
   - Verify CONFIG object values in Code.gs
   - Ensure API_TOKEN matches between script and frontend

### If frontend still shows errors:
1. **Clear browser cache** and reload
2. **Check environment variables** in `.env.local`
3. **Restart development server** after env changes
4. **Check network requests** in browser dev tools

## Success Criteria

### ✅ All tests must pass:
- [ ] **API endpoints return valid JSON**
- [ ] **Materials list contains 5 items**
- [ ] **Authentication works with test credentials**
- [ ] **Error handling works correctly**
- [ ] **Frontend loads materials without errors**
- [ ] **No "Reintentar cargar materiales" message**

## Final Verification

Once all checkboxes are completed:
- [ ] **Take screenshot** of working materials page
- [ ] **Document any issues** encountered during deployment
- [ ] **Test from different browser** to ensure consistency
- [ ] **Verify API works from different network** (mobile hotspot test)

---

**Deployment Status**: ⏳ Pending
**Last Updated**: $(date)
**Deployed By**: [Your Name]
**Deployment URL**: https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec