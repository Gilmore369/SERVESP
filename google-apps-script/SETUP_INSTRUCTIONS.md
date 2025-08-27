# ServesPlatform Database Setup Instructions

## Overview

This document provides step-by-step instructions to set up the Google Sheets database structure for ServesPlatform.

## Prerequisites

- Google Account with access to Google Apps Script
- Google Drive access to create spreadsheets

## Setup Steps

### 1. Open Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Rename the project to "ServesPlatform_Backend"

### 2. Add Database Setup Code

1. Copy the contents of `Database.gs` file
2. Paste it into the Apps Script editor
3. Save the project (Ctrl+S)

### 3. Run Database Setup

1. In the Apps Script editor, select the `setupDatabase` function from the dropdown
2. Click the "Run" button (▶️)
3. Grant necessary permissions when prompted:
   - Allow access to Google Sheets
   - Allow access to Google Drive
4. Check the execution log for the spreadsheet ID and URL

### 4. Save Configuration

After successful execution, you'll see output like:

```
Created spreadsheet with ID: 1ABC123...XYZ
Spreadsheet URL: https://docs.google.com/spreadsheets/d/1ABC123...XYZ/edit
```

**Important**: Save the Spreadsheet ID for your Apps Script configuration!

## Database Structure Created

The setup creates a spreadsheet named "ServesPlatform_DB" with the following sheets:

### Core Sheets

- **Usuarios**: User authentication and role management
- **Clientes**: Client/company information
- **Proyectos**: Project lifecycle management
- **Actividades**: Activity/task management with WBS structure

### Personnel & Time Tracking

- **Colaboradores**: Personnel with skills and certifications
- **Asignaciones**: Project assignments and scheduling
- **Horas**: Time tracking and timesheet entries

### Materials & Inventory

- **Materiales**: Material catalog with inventory tracking
- **BOM**: Bill of materials per activity

### Configuration

- **Config**: System configuration parameters
- **Checklists**: Reusable checklist templates

## Features Included

### Data Validation

- Dropdown lists for status fields, roles, priorities
- Consistent data entry across all sheets
- Input validation for critical fields

### Conditional Formatting

- Stock level alerts (red background when stock ≤ minimum)
- Quantity alerts in BOM (yellow background when assigned < required)

### Sample Data

Each sheet includes sample records to demonstrate the structure and help with testing.

### Security Features

- Protected header rows
- Hidden password hash column in Users sheet
- Proper column sizing for readability

## Next Steps

1. **Configure Apps Script Properties**:

   - Set `SHEET_ID` property with the generated spreadsheet ID
   - Set `API_TOKEN` for API security
   - Set `JWT_SECRET` for authentication

2. **Deploy as Web App**:

   - Deploy the Apps Script as a web application
   - Configure permissions and access levels

3. **Test Database Structure**:
   - Verify all sheets are created correctly
   - Test data validation rules
   - Confirm sample data is present

## Troubleshooting

### Common Issues

- **Permission Denied**: Ensure you've granted all required permissions
- **Execution Timeout**: The setup might take a few minutes for large datasets
- **Sheet Already Exists**: Delete existing sheets or use a different spreadsheet name

### Verification Steps

1. Open the created spreadsheet URL
2. Verify all 9 sheets are present
3. Check that headers are formatted (blue background, white text)
4. Confirm data validation dropdowns work
5. Verify sample data is populated

## Support

If you encounter issues during setup, check the Apps Script execution log for detailed error messages.
