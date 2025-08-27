# ServesPlatform Seed Data Documentation

This document describes the seed data functionality for ServesPlatform, which creates demo users, sample data, and initial system configuration for testing and development purposes.

## Overview

The seed data system consists of three main components:

1. **SeedData.gs** - Creates demo users, clients, and system configuration
2. **SeedOperationalData.gs** - Creates sample projects, personnel, materials, and operational data
3. **SetupComplete.gs** - Orchestrates the complete setup process

## Requirements Fulfilled

### Task 13.1: Create demo users and authentication data
- ✅ Generate demo users with hashed passwords (Requirements: 1.1, 7.1)
- ✅ Create sample client data
- ✅ Setup initial system configuration

### Task 13.2: Create sample project and operational data
- ✅ Generate demo projects with activities (Requirements: 3.1)
- ✅ Create sample personnel with assignments (Requirements: 4.1)
- ✅ Add sample materials and BOM data (Requirements: 5.1)
- ✅ Generate sample time entries

## Demo Users Created

The system creates the following demo users with different roles:

| Role | Email | Password | Name |
|------|-------|----------|------|
| admin_lider | admin@servesplatform.com | admin123 | Administrador Principal |
| admin | admin.sistemas@servesplatform.com | admin456 | Admin de Sistemas |
| editor | gerente.proyectos@servesplatform.com | editor123 | María González |
| editor | supervisor.campo@servesplatform.com | editor456 | Carlos Rodríguez |
| tecnico | tecnico.electricista@servesplatform.com | tecnico123 | Juan Pérez |
| tecnico | tecnico.civil@servesplatform.com | tecnico456 | Ana López |

## Sample Data Created

### Clients (5 companies)
- Constructora Lima Norte S.A.C.
- Inmobiliaria San Isidro S.A.
- Industrias Manufactureras del Perú S.A.
- Centro Comercial Plaza Norte S.A.C.
- Hospital Nacional Dos de Mayo

### Personnel (6 collaborators)
- Juan Carlos Pérez López (Electricista)
- Ana María López García (Técnico Civil)
- Carlos Eduardo Rodríguez Vega (Técnico CCTV)
- María Elena Vásquez Torres (Supervisor)
- Roberto Silva Mendoza (Mantenimiento)
- Patricia Mendoza Flores (Ingeniero)

### Materials (10 items)
- Electrical cables (THW 12 AWG, THW 14 AWG)
- Connectors (MC4 Male/Female)
- Electrical panels and breakers
- CCTV cameras and UTP cables
- Tools and safety equipment

### Projects (3 demo projects)
1. **Electrical Installation** - Corporate building electrical system
2. **CCTV System** - Shopping center video surveillance
3. **Preventive Maintenance** - Hospital electrical and medical equipment

### Activities
- Each project includes 1-3 sample activities
- Activities have different states (Completed, In Progress, Pending)
- Linked to appropriate checklists and personnel

### System Configuration
- 20 configuration parameters including:
  - Timezone, currency, code prefixes
  - Alert thresholds and multipliers
  - System settings and limits

## Functions Available

### Main Setup Functions

#### `setupCompleteSystem()`
Runs the complete setup process:
1. Creates database structure
2. Populates seed data
3. Populates operational data
4. Tests authentication
5. Returns comprehensive setup report

#### `setupDevelopmentEnvironment()`
Creates minimal setup for development:
- Basic database structure
- Essential demo users and clients
- Minimal operational data

#### `resetAndRepopulateData()`
Clears existing data and repopulates with fresh seed data.

### Individual Data Creation Functions

#### `populateSeedData()`
Creates demo users, clients, and system configuration.

#### `populateOperationalData()`
Creates projects, personnel, materials, and operational data.

#### `createDemoUsers()`
Creates 6 demo users with different roles and hashed passwords.

#### `createSampleClients()`
Creates 5 sample client companies.

#### `createSamplePersonnel()`
Creates 6 sample personnel with certifications.

#### `createSampleMaterials()`
Creates 10 sample materials with inventory data.

### Validation Functions

#### `validateSetup()`
Validates the complete setup:
- Database structure
- Seed data presence
- Operational data
- Authentication system
- Configuration

#### `testDemoAuthentication()`
Tests authentication with all demo users and returns results.

## Usage Instructions

### 1. Complete Setup (Recommended)
```javascript
// Run this function for complete setup
const result = setupCompleteSystem();
console.log(result);
```

### 2. Development Setup
```javascript
// For minimal development setup
const result = setupDevelopmentEnvironment();
console.log(result);
```

### 3. Reset Data
```javascript
// To clear and repopulate data
const result = resetAndRepopulateData();
console.log(result);
```

### 4. Validate Setup
```javascript
// To validate current setup
const validation = validateSetup();
console.log(validation);
```

## Configuration Requirements

Before running the seed data functions, ensure these Script Properties are set:

| Property | Description | Example |
|----------|-------------|---------|
| SHEET_ID | Google Sheets ID | 1abc...xyz |
| API_TOKEN | Secure API token | your-secure-token-123 |
| JWT_SECRET | JWT signing secret | your-jwt-secret-min-32-chars |
| ENVIRONMENT | Environment name | development |

## Data Structure

### ID Generation
All records use prefixed IDs with timestamp and random components:
- Users: `USR_[timestamp][random]`
- Clients: `CLI_[timestamp][random]`
- Projects: `PRY_[timestamp][random]`
- Activities: `ACT_[timestamp][random]`
- Materials: `MAT_[timestamp][random]`

### Password Hashing
User passwords are hashed using SHA-256 algorithm for security.

### Timestamps
All records include `created_at` and `updated_at` timestamps.

### JSON Fields
Complex data (certifications, checklists) stored as JSON strings in appropriate fields.

## Testing the Setup

### 1. Authentication Test
```javascript
// Test authentication for all demo users
const authResults = testDemoAuthentication();
console.log('Authentication Results:', authResults);
```

### 2. API Test
Use the demo credentials to test API endpoints:

```bash
# Test authentication
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "auth",
    "email": "admin@servesplatform.com",
    "password": "admin123",
    "token": "YOUR_API_TOKEN"
  }'
```

### 3. Data Validation
```javascript
// Validate all setup components
const validation = validateSetup();
console.log('Validation Results:', validation);
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure script has permission to create/modify spreadsheets
   - Check Google Apps Script execution permissions

2. **Missing Dependencies**
   - Ensure Database.gs is properly configured
   - Verify all required sheets exist

3. **Authentication Failures**
   - Check JWT_SECRET is set in Script Properties
   - Verify API_TOKEN configuration

4. **Data Conflicts**
   - Run `clearExistingData()` before repopulating
   - Check for duplicate IDs or email addresses

### Debug Functions

```javascript
// Get demo credentials
const credentials = getDemoCredentials();
console.log(credentials);

// Get setup instructions
const instructions = getSetupInstructions();
console.log(instructions);

// Display setup summary
displaySetupSummary();
```

## Security Considerations

1. **Password Security**: Demo passwords are simple for testing. Change them in production.
2. **API Token**: Use strong, unique API tokens in production.
3. **JWT Secret**: Use cryptographically secure JWT secrets (min 32 characters).
4. **Access Control**: Ensure proper role-based access control is implemented.

## Next Steps

After running the seed data setup:

1. Update Script Properties with secure values
2. Deploy as Web App with appropriate permissions
3. Test all API endpoints with demo credentials
4. Configure frontend application with Web App URL
5. Replace demo data with real data for production use

## File Structure

```
google-apps-script/
├── SeedData.gs              # Demo users and configuration
├── SeedOperationalData.gs   # Projects and operational data
├── SetupComplete.gs         # Complete setup orchestration
├── SEED_DATA_README.md      # This documentation
├── Database.gs              # Database structure (dependency)
├── Auth.gs                  # Authentication (dependency)
└── CRUD.gs                  # CRUD operations (dependency)
```

## Support

For issues or questions about the seed data functionality:
1. Check the validation results using `validateSetup()`
2. Review the setup instructions using `getSetupInstructions()`
3. Verify all dependencies are properly configured
4. Check Google Apps Script execution logs for detailed error messages