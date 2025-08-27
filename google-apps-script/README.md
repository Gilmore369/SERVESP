# ServesPlatform Google Apps Script Backend

This directory contains the Google Apps Script backend for ServesPlatform.

## Setup Instructions

### 1. Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default `Code.gs` with the contents from this directory
4. Add additional `.gs` files by clicking the "+" button next to "Files"

### 2. Configure Script Properties

Run the `initializeProperties()` function once to set up the required properties, then update them:

1. In the Apps Script editor, go to Project Settings (gear icon)
2. Scroll down to "Script Properties"
3. Update the following properties:

```
SHEET_ID: Your Google Sheets ID (from the URL)
API_TOKEN: A secure random token for API access
JWT_SECRET: A secure secret key for JWT signing
ENVIRONMENT: development or production
```

### 3. Create Google Sheets Database

1. Create a new Google Sheets document
2. Copy the Sheet ID from the URL (between `/d/` and `/edit`)
3. Update the `SHEET_ID` property in Script Properties
4. The sheets will be created automatically when first accessed

### 4. Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the Web App URL for use in the frontend

### 5. Test the API

Use the provided test endpoints:

```bash
# Test authentication
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "auth",
    "token": "your-api-token",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

## File Structure

- `Code.gs` - Main entry point and request handling
- `Auth.gs` - Authentication and JWT handling
- `Database.gs` - Google Sheets database operations
- `CRUD.gs` - CRUD operations with role-based permissions
- `appsscript.json` - Project configuration

## Security Notes

- Always use HTTPS for production deployments
- Keep API tokens and JWT secrets secure
- Regularly rotate authentication tokens
- Monitor access logs for suspicious activity

## Database Schema

The following sheets will be created automatically:

- **Usuarios** - User accounts and authentication
- **Proyectos** - Project management
- **Actividades** - Project activities and tasks
- **Colaboradores** - Personnel management
- **Clientes** - Client information
- **Asignaciones** - Personnel assignments
- **Horas** - Time tracking
- **Materiales** - Materials catalog
- **BOM** - Bill of materials per activity

## API Endpoints

### Authentication
- `POST /?action=auth` - User login
- `GET /?action=whoami` - Validate JWT token

### CRUD Operations
- `POST /?action=crud` - Generic CRUD operations

All requests require the `token` parameter with your API token.
CRUD operations also require a valid JWT token.