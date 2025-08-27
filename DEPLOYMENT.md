# ServesPlatform Deployment Guide

This guide covers the complete deployment process for ServesPlatform, including both the Next.js frontend and Google Apps Script backend.

## Prerequisites

- Node.js 18+ installed
- Google account with access to Google Sheets and Apps Script
- Vercel account (for frontend deployment)

## Backend Deployment (Google Apps Script)

### 1. Setup Google Sheets Database

1. Create a new Google Sheets document
2. Name it "ServesPlatform_DB"
3. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Deploy Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Name the project "ServesPlatform_API"
4. Copy all `.gs` files from the `google-apps-script/` directory
5. Copy the `appsscript.json` configuration

### 3. Configure Script Properties

1. In Apps Script editor, click the gear icon (Project Settings)
2. Scroll to "Script Properties"
3. Add the following properties:

```
SHEET_ID: [Your Google Sheets ID]
API_TOKEN: [Generate a secure random token]
JWT_SECRET: [Generate a secure JWT secret]
ENVIRONMENT: production
```

### 4. Deploy Web App

1. Click "Deploy" > "New deployment"
2. Select "Web app" type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the Web App URL

### 5. Test Backend

```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "whoami",
    "token": "your-api-token"
  }'
```

## Frontend Deployment (Vercel)

### 1. Configure Environment Variables

Update the `.env.local` file in the `serves-platform/` directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_API_TOKEN=your-secure-api-token
NEXT_PUBLIC_APP_NAME=ServesPlatform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI

```bash
cd serves-platform
npm install -g vercel
vercel --prod
```

#### Option B: GitHub Integration

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### 3. Configure Environment Variables in Vercel

In the Vercel dashboard:

1. Go to Project Settings > Environment Variables
2. Add the same variables from `.env.local`
3. Redeploy the application

## Initial Data Setup

### 1. Create Admin User

Run this in the Google Apps Script editor:

```javascript
function createAdminUser() {
  const sheet = getSheet("Usuarios");
  const adminUser = {
    id: generateId("Usuarios"),
    email: "admin@servesplatform.com",
    nombre: "Administrator",
    rol: "admin_lider",
    password_hash: hashPassword("admin123"),
    activo: true,
  };

  addTimestamps(adminUser, false);
  insertRecord(sheet, adminUser);
  console.log("Admin user created:", adminUser.email);
}
```

### 2. Create Sample Data (Optional)

```javascript
function createSampleData() {
  // Create sample client
  const clientSheet = getSheet("Clientes");
  const sampleClient = {
    id: generateId("Clientes"),
    ruc: "20123456789",
    razon_social: "Empresa Demo SAC",
    nombre_comercial: "Demo Corp",
    direccion: "Av. Demo 123, Lima",
    telefono: "+51 1 234-5678",
    email: "contacto@demo.com",
    contacto_principal: "Juan Demo",
    activo: true,
  };

  addTimestamps(sampleClient, false);
  insertRecord(clientSheet, sampleClient);

  console.log("Sample data created");
}
```

## Security Configuration

### 1. API Security

- Use strong, random API tokens (minimum 32 characters)
- Rotate tokens regularly
- Monitor access logs for suspicious activity

### 2. JWT Security

- Use strong JWT secrets (minimum 32 characters)
- Set appropriate expiration times (24 hours recommended)
- Implement token refresh mechanism if needed

### 3. Google Sheets Security

- Limit sheet access to necessary users only
- Enable audit logging
- Regular backup of data

## Monitoring and Maintenance

### 1. Error Monitoring

- Check Google Apps Script execution logs regularly
- Monitor Vercel deployment logs
- Set up alerts for critical errors

### 2. Performance Monitoring

- Monitor API response times
- Check Google Sheets quota usage
- Monitor Vercel function execution times

### 3. Backup Strategy

- Regular export of Google Sheets data
- Version control for code changes
- Document configuration changes

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure proper CORS headers in Apps Script
2. **Authentication Failures**: Check JWT secret and API token configuration
3. **Sheet Access Errors**: Verify Sheet ID and permissions
4. **Deployment Failures**: Check environment variables and build logs

### Debug Mode

Enable debug logging by setting `ENVIRONMENT=development` in Script Properties.

## Production Checklist

- [ ] Google Sheets database created and configured
- [ ] Google Apps Script deployed with correct properties
- [ ] API endpoints tested and working
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Admin user created
- [ ] SSL/HTTPS enabled
- [ ] Error monitoring configured
- [ ] Backup strategy implemented
- [ ] Documentation updated

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review Google Apps Script execution logs
3. Check Vercel deployment logs
4. Verify environment variable configuration
