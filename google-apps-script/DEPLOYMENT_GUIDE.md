# ServesPlatform Google Apps Script Deployment Guide

## Overview

This guide provides complete step-by-step instructions for deploying the ServesPlatform backend using Google Apps Script. The backend serves as a REST API that uses Google Sheets as the database.

## Prerequisites

- Google Account with Google Apps Script access
- Google Drive access for creating spreadsheets
- Basic understanding of Google Apps Script console

## Deployment Steps

### Step 1: Create Google Apps Script Project

1. **Open Google Apps Script Console**
   - Navigate to [script.google.com](https://script.google.com)
   - Sign in with your Google account
   - Click "New Project"

2. **Configure Project Settings**
   - Rename the project to "ServesPlatform_Backend"
   - Note the project URL for future reference

### Step 2: Upload Source Code

1. **Delete Default Code**
   - Delete the default `Code.gs` content
   - Keep the file name as `Code.gs`

2. **Add All Source Files**
   Copy and paste the content from each file in this order:

   **File 1: Code.gs**
   - Copy content from `Code.gs`
   - This is the main entry point

   **File 2: Auth.gs**
   - Click the "+" button next to "Files"
   - Select "Script" and name it "Auth"
   - Copy content from `Auth.gs`

   **File 3: CRUD.gs**
   - Add new script file named "CRUD"
   - Copy content from `CRUD.gs`

   **File 4: Database.gs**
   - Add new script file named "Database"
   - Copy content from `Database.gs`

   **File 5: SeedData.gs**
   - Add new script file named "SeedData"
   - Copy content from `SeedData.gs`

   **File 6: SeedOperationalData.gs**
   - Add new script file named "SeedOperationalData"
   - Copy content from `SeedOperationalData.gs`

   **File 7: SetupComplete.gs**
   - Add new script file named "SetupComplete"
   - Copy content from `SetupComplete.gs`

3. **Save the Project**
   - Press `Ctrl+S` or click the save icon
   - Ensure all files are saved without errors

### Step 3: Setup Database

1. **Run Database Setup**
   - In the Apps Script editor, select `setupDatabase` from the function dropdown
   - Click the "Run" button (▶️)
   - **Grant Permissions**: When prompted, click "Review permissions"
     - Click "Advanced" if you see a warning
     - Click "Go to ServesPlatform_Backend (unsafe)"
     - Click "Allow"

2. **Capture Database Information**
   - Check the execution log (View → Logs)
   - Copy the Spreadsheet ID from the log output
   - Example: `Created spreadsheet with ID: 1ABC123def456GHI789jkl`
   - Save this ID - you'll need it for configuration

### Step 4: Configure Environment Variables

1. **Open Project Settings**
   - Click the gear icon (⚙️) in the left sidebar
   - Select "Script Properties"

2. **Add Required Properties**
   Click "Add script property" for each of the following:

   | Property Name | Example Value | Description |
   |---------------|---------------|-------------|
   | `SHEET_ID` | `1ABC123def456GHI789jkl` | Your Google Sheet ID from Step 3 |
   | `API_TOKEN` | `serves_platform_2024_secure_token` | Secure API token (create your own) |
   | `JWT_SECRET` | `your_jwt_secret_key_minimum_32_chars` | JWT signing secret (min 32 characters) |
   | `ENVIRONMENT` | `production` | Environment setting |

   **Security Notes:**
   - Make `API_TOKEN` at least 32 characters long
   - Make `JWT_SECRET` at least 32 characters long
   - Use random, secure values for production
   - Never share these values publicly

### Step 5: Deploy as Web App

1. **Start Deployment**
   - Click "Deploy" button (top right)
   - Select "New deployment"

2. **Configure Deployment Settings**
   - **Type**: Select "Web app"
   - **Description**: "ServesPlatform Backend API v1.0"
   - **Execute as**: "Me (your-email@gmail.com)"
   - **Who has access**: "Anyone"

3. **Complete Deployment**
   - Click "Deploy"
   - **Grant Additional Permissions** if prompted
   - Copy the Web App URL from the deployment confirmation
   - Example: `https://script.google.com/macros/s/ABC123.../exec`

### Step 6: Test Deployment

1. **Test Basic Connectivity**
   ```bash
   curl -X GET "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=test&token=your_api_token"
   ```

2. **Test Authentication Endpoint**
   ```bash
   curl -X POST "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" \
     -H "Content-Type: application/json" \
     -d '{
       "action": "auth",
       "token": "your_api_token",
       "email": "admin@servesplatform.com",
       "password": "admin123"
     }'
   ```

3. **Expected Response**
   ```json
   {
     "ok": true,
     "data": {
       "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": "USR_...",
         "email": "admin@servesplatform.com",
         "nombre": "Administrador",
         "rol": "admin_lider"
       }
     },
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

### Step 7: Populate Sample Data (Optional)

1. **Run Seed Data Functions**
   - In Apps Script editor, select `seedAllData` from dropdown
   - Click "Run" to populate sample data
   - Check execution log for confirmation

2. **Verify Data Population**
   - Open your Google Sheet (use the URL from Step 3)
   - Verify all sheets have sample data
   - Test login with sample users

## Security Configuration

### API Token Security
- Use a strong, unique API token
- Rotate tokens periodically
- Never commit tokens to version control
- Consider using environment-specific tokens

### JWT Configuration
- Use a strong JWT secret (minimum 32 characters)
- Set appropriate token expiration (default: 24 hours)
- Consider shorter expiration for sensitive environments

### Access Control
- Deploy with "Execute as: Me" for consistent permissions
- Use "Anyone" access only if needed
- Consider domain-restricted access for internal use

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SHEET_ID` | Yes | Google Sheets database ID | `1ABC123def456GHI789jkl` |
| `API_TOKEN` | Yes | API authentication token | `serves_platform_secure_token_2024` |
| `JWT_SECRET` | Yes | JWT signing secret | `your_jwt_secret_minimum_32_characters` |
| `ENVIRONMENT` | No | Environment identifier | `production` (default) |

## API Endpoints Reference

### Authentication
- **POST** `/` - User authentication
- **GET** `/?action=whoami` - Validate JWT token

### CRUD Operations
- **POST** `/` - Generic CRUD operations for all tables
- **GET** `/?action=crud&table=...` - List records
- **POST** `/` - Create/Update/Delete records

### User Management
- **POST** `/?action=createUser` - Create new user (admin only)
- **POST** `/?action=updateUser` - Update user (admin only)
- **POST** `/?action=deactivateUser` - Deactivate user (admin only)

## Troubleshooting

### Common Issues

1. **"Invalid API token" Error**
   - Verify `API_TOKEN` in Script Properties
   - Ensure token matches in your requests
   - Check for typos or extra spaces

2. **"Spreadsheet not found" Error**
   - Verify `SHEET_ID` in Script Properties
   - Ensure the spreadsheet exists and is accessible
   - Check spreadsheet permissions

3. **"JWT verification failed" Error**
   - Verify `JWT_SECRET` in Script Properties
   - Ensure JWT_SECRET is at least 32 characters
   - Check token expiration

4. **CORS Errors**
   - Ensure proper CORS headers are set
   - Check if deployment allows external access
   - Verify "Anyone" access is selected

### Debugging Steps

1. **Check Execution Logs**
   - Go to Apps Script editor
   - Click "Executions" in left sidebar
   - Review recent execution logs

2. **Test Individual Functions**
   - Select specific functions in dropdown
   - Run them individually to isolate issues
   - Check console output

3. **Verify Permissions**
   - Ensure all required permissions are granted
   - Re-authorize if needed
   - Check Google Sheet access permissions

## Maintenance

### Regular Tasks
- Monitor execution quotas and limits
- Review and rotate security tokens
- Update sample data as needed
- Monitor error logs for issues

### Updates and Versioning
- Create new deployments for major updates
- Test changes in development environment first
- Keep backup of working configurations
- Document changes in deployment description

## Support and Resources

- **Google Apps Script Documentation**: [developers.google.com/apps-script](https://developers.google.com/apps-script)
- **Google Sheets API**: [developers.google.com/sheets/api](https://developers.google.com/sheets/api)
- **Execution Limits**: [developers.google.com/apps-script/guides/services/quotas](https://developers.google.com/apps-script/guides/services/quotas)

---

**Next Steps**: After successful deployment, proceed to configure the Next.js frontend with your Web App URL and API token.