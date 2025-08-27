 # Google Apps Script Deployment Instructions

## Step 1: Update the Google Apps Script Code

1. **Open your Google Apps Script project**:

   - Go to https://script.google.com
   - Open your existing ServesPlatform project

2. **Replace the Code.gs file**:

   - Select all content in the current Code.gs file
   - Delete it completely
   - Copy the entire content from `google-apps-script/Code.gs` in this project
   - Paste it into the Google Apps Script editor

3. **Save the changes**:
   - Press Ctrl+S (or Cmd+S on Mac) to save
   - The script should compile without errors

## Step 2: Deploy as Web Application

1. **Click on "Deploy" button** (top right corner)
2. **Select "New deployment"**
3. **Configure deployment settings**:

   - **Type**: Select "Web app"
   - **Description**: "ServesPlatform API - Complete Implementation"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"

4. **Click "Deploy"**
5. **Copy the Web App URL** - it should be:
   ```
   https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec
   ```

## Step 3: Test the API Endpoints

### Test 1: Basic API Health Check

Open this URL in your browser:

```
https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=demo-token-2024&action=whoami
```

**Expected Response**:

```json
{
  "ok": true,
  "data": {
    "id": "user_admin_001",
    "email": "admin@servesplatform.com",
    "name": "Administrador",
    "role": "admin",
    ...
  },
  "status": 200,
  "timestamp": "2024-...",
  "error": false,
  "message": "Request completed successfully"
}
```

### Test 2: Materials List (Most Important)

Open this URL in your browser:

```
https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=demo-token-2024&action=crud&operation=list&table=Materials
```

**Expected Response**:

```json
{
  "ok": true,
  "data": [
    {
      "id": "mat_001",
      "sku": "CEM-001",
      "descripcion": "Cemento Portland Tipo I - 50kg",
      "categoria": "Cemento",
      "unidad": "Bolsa",
      "costo_ref": 25.50,
      "stock_actual": 150,
      "stock_minimo": 20,
      "proveedor_principal": "Cementos Lima",
      "activo": true,
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      "fecha_actualizacion": "2024-01-20T14:45:00.000Z"
    },
    ... (4 more materials)
  ],
  "status": 200,
  "timestamp": "2024-...",
  "error": false,
  "message": "Request completed successfully"
}
```

### Test 3: Authentication

Open this URL in your browser:

```
https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec?token=demo-token-2024&action=auth&email=admin@servesplatform.com&password=admin123
```

**Expected Response**:

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "user_admin_001",
      "email": "admin@servesplatform.com",
      "name": "Administrador",
      "role": "admin",
      ...
    },
    "token": "mock_jwt_...",
    "message": "Login successful"
  },
  "status": 200,
  "timestamp": "2024-...",
  "error": false,
  "message": "Request completed successfully"
}
```

## Step 4: Verify Frontend Integration

1. **Start the frontend application**:

   ```bash
   cd serves-platform
   npm run dev
   ```

2. **Navigate to the materials page**:

   - Open http://localhost:3000/materiales
   - The page should load without the "Reintentar cargar materiales" error
   - You should see 5 materials listed

3. **Check the browser console**:
   - Open Developer Tools (F12)
   - Look for any API errors in the Console tab
   - Network tab should show successful API calls

## Troubleshooting

### If you get "Invalid API token" error:

- Verify the token in the URL matches: `demo-token-2024`
- Check that the CONFIG object in Code.gs has the correct API_TOKEN

### If you get "Script function not found" error:

- Make sure you saved the Code.gs file after pasting the new content
- Try refreshing the Google Apps Script page and saving again

### If the frontend still shows errors:

- Check that the NEXT_PUBLIC_API_BASE_URL in `.env.local` matches your deployment URL
- Verify the NEXT_PUBLIC_API_TOKEN matches `demo-token-2024`

### If responses are malformed:

- Check the Google Apps Script execution logs:
  - In Google Apps Script, go to "Executions" tab
  - Look for recent executions and any error messages

## Success Criteria

✅ **All three test URLs return valid JSON responses**
✅ **Materials page loads without errors**
✅ **5 materials are displayed on the frontend**
✅ **No "Reintentar cargar materiales" error appears**

## Next Steps

Once deployment is successful:

1. Test all CRUD operations through the frontend
2. Verify authentication flow works
3. Check that error handling is working properly
4. Monitor the Google Apps Script execution logs for any issues
