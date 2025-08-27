/**
 * Complete Setup Script for ServesPlatform
 * Combines database setup with seed data population
 */

/**
 * Complete setup function - runs database setup and seed data population
 * This is the main function to run for a complete system setup
 */
function setupCompleteSystem() {
  try {
    console.log('=== Starting Complete ServesPlatform Setup ===');
    
    // Step 1: Setup database structure
    console.log('Step 1: Setting up database structure...');
    const dbResult = setupDatabase();
    
    if (!dbResult.success) {
      throw new Error('Database setup failed');
    }
    
    console.log('Database setup completed successfully');
    console.log('Spreadsheet ID:', dbResult.spreadsheetId);
    console.log('Spreadsheet URL:', dbResult.url);
    
    // Step 2: Populate seed data
    console.log('Step 2: Populating seed data...');
    const seedResult = populateSeedData();
    
    if (!seedResult.success) {
      throw new Error('Seed data population failed');
    }
    
    console.log('Seed data populated successfully');
    
    // Step 3: Populate operational data
    console.log('Step 3: Populating operational data...');
    const operationalResult = populateOperationalData();
    
    if (!operationalResult.success) {
      throw new Error('Operational data population failed');
    }
    
    console.log('Operational data populated successfully');
    
    // Step 4: Test authentication
    console.log('Step 4: Testing authentication...');
    const authResults = testDemoAuthentication();
    
    console.log('=== Setup Complete ===');
    
    const result = {
      success: true,
      message: 'ServesPlatform setup completed successfully',
      spreadsheetId: dbResult.spreadsheetId,
      spreadsheetUrl: dbResult.url,
      demoCredentials: getDemoCredentials(),
      authenticationTest: authResults,
      setupSteps: [
        'Database structure created',
        'Demo users and configuration populated',
        'Sample clients created',
        'Sample personnel and materials added',
        'Demo projects with activities created',
        'Sample assignments and time entries generated',
        'Authentication system tested'
      ],
      nextSteps: [
        '1. Update Script Properties with the Spreadsheet ID',
        '2. Set API_TOKEN and JWT_SECRET in Script Properties',
        '3. Deploy as Web App with Execute as "Me" and access "Anyone"',
        '4. Test API endpoints using the provided demo credentials',
        '5. Configure frontend with the Web App URL'
      ],
      timestamp: new Date().toISOString()
    };
    
    console.log('Setup Result:', JSON.stringify(result, null, 2));
    return result;
    
  } catch (error) {
    console.error('Complete setup failed:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Quick setup for development - minimal data
 */
function setupDevelopmentEnvironment() {
  try {
    console.log('=== Setting up Development Environment ===');
    
    // Setup database
    const dbResult = setupDatabase();
    
    // Create minimal seed data
    createDemoUsers();
    createSampleClients();
    setupInitialConfiguration();
    
    // Create minimal operational data
    createSamplePersonnel();
    createSampleMaterials();
    
    console.log('Development environment setup completed');
    
    return {
      success: true,
      message: 'Development environment ready',
      spreadsheetId: dbResult.spreadsheetId,
      spreadsheetUrl: dbResult.url,
      demoCredentials: getDemoCredentials()
    };
    
  } catch (error) {
    console.error('Development setup failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Reset all data and repopulate
 */
function resetAndRepopulateData() {
  try {
    console.log('=== Resetting and Repopulating Data ===');
    
    // Clear existing data
    clearExistingData();
    
    // Repopulate all data
    const seedResult = populateSeedData();
    const operationalResult = populateOperationalData();
    
    console.log('Data reset and repopulation completed');
    
    return {
      success: true,
      message: 'Data reset and repopulated successfully',
      seedResult: seedResult,
      operationalResult: operationalResult
    };
    
  } catch (error) {
    console.error('Reset and repopulate failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validate current setup
 */
function validateSetup() {
  try {
    console.log('=== Validating Setup ===');
    
    const validation = {
      database: validateDatabaseStructure(),
      seedData: validateSeedData(),
      operationalData: validateOperationalData(),
      authentication: testDemoAuthentication(),
      configuration: validateConfiguration()
    };
    
    const allValid = Object.values(validation).every(v => v.success !== false);
    
    return {
      success: allValid,
      message: allValid ? 'Setup validation passed' : 'Setup validation found issues',
      validation: validation,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Setup validation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validate database structure
 */
function validateDatabaseStructure() {
  const requiredSheets = [
    'Usuarios', 'Clientes', 'Proyectos', 'Actividades',
    'Colaboradores', 'Asignaciones', 'Horas', 'Materiales', 'BOM',
    'Config', 'Checklists'
  ];
  
  const missingSheets = [];
  
  requiredSheets.forEach(sheetName => {
    try {
      getSheet(sheetName);
    } catch (error) {
      missingSheets.push(sheetName);
    }
  });
  
  return {
    success: missingSheets.length === 0,
    message: missingSheets.length === 0 ? 'All required sheets exist' : `Missing sheets: ${missingSheets.join(', ')}`,
    missingSheets: missingSheets
  };
}

/**
 * Validate seed data
 */
function validateSeedData() {
  try {
    const usersSheet = getSheet('Usuarios');
    const users = getSheetData(usersSheet);
    
    const clientsSheet = getSheet('Clientes');
    const clients = getSheetData(clientsSheet);
    
    const configSheet = getSheet('Config');
    const config = getSheetData(configSheet);
    
    return {
      success: users.length > 0 && clients.length > 0 && config.length > 0,
      message: 'Seed data validation completed',
      counts: {
        users: users.length,
        clients: clients.length,
        config: config.length
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Seed data validation failed',
      error: error.message
    };
  }
}

/**
 * Validate operational data
 */
function validateOperationalData() {
  try {
    const projectsSheet = getSheet('Proyectos');
    const projects = getSheetData(projectsSheet);
    
    const activitiesSheet = getSheet('Actividades');
    const activities = getSheetData(activitiesSheet);
    
    const collaboratorsSheet = getSheet('Colaboradores');
    const collaborators = getSheetData(collaboratorsSheet);
    
    const materialsSheet = getSheet('Materiales');
    const materials = getSheetData(materialsSheet);
    
    return {
      success: projects.length > 0 && activities.length > 0 && collaborators.length > 0 && materials.length > 0,
      message: 'Operational data validation completed',
      counts: {
        projects: projects.length,
        activities: activities.length,
        collaborators: collaborators.length,
        materials: materials.length
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Operational data validation failed',
      error: error.message
    };
  }
}

/**
 * Validate configuration
 */
function validateConfiguration() {
  try {
    const requiredProperties = ['SHEET_ID', 'API_TOKEN', 'JWT_SECRET'];
    const properties = PropertiesService.getScriptProperties().getProperties();
    
    const missingProperties = requiredProperties.filter(prop => !properties[prop]);
    
    return {
      success: missingProperties.length === 0,
      message: missingProperties.length === 0 ? 'All required properties configured' : `Missing properties: ${missingProperties.join(', ')}`,
      missingProperties: missingProperties,
      configuredProperties: Object.keys(properties)
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Configuration validation failed',
      error: error.message
    };
  }
}

/**
 * Get setup instructions
 */
function getSetupInstructions() {
  return {
    title: 'ServesPlatform Setup Instructions',
    steps: [
      {
        step: 1,
        title: 'Run Complete Setup',
        description: 'Execute setupCompleteSystem() function to create database and populate data',
        function: 'setupCompleteSystem()'
      },
      {
        step: 2,
        title: 'Configure Script Properties',
        description: 'Set SHEET_ID, API_TOKEN, and JWT_SECRET in Script Properties',
        details: [
          'Go to Project Settings > Script Properties',
          'Add SHEET_ID with the spreadsheet ID from step 1',
          'Add API_TOKEN with a secure random string',
          'Add JWT_SECRET with a secure random string (min 32 characters)'
        ]
      },
      {
        step: 3,
        title: 'Deploy Web App',
        description: 'Deploy the script as a Web App',
        details: [
          'Click Deploy > New Deployment',
          'Choose type: Web app',
          'Execute as: Me',
          'Who has access: Anyone',
          'Click Deploy and copy the Web App URL'
        ]
      },
      {
        step: 4,
        title: 'Test API',
        description: 'Test the API endpoints using demo credentials',
        testCredentials: getDemoCredentials()
      },
      {
        step: 5,
        title: 'Configure Frontend',
        description: 'Update frontend configuration with Web App URL and API token'
      }
    ],
    troubleshooting: [
      {
        issue: 'Permission denied errors',
        solution: 'Ensure script has permission to create and modify spreadsheets'
      },
      {
        issue: 'Authentication failures',
        solution: 'Verify JWT_SECRET is set correctly in Script Properties'
      },
      {
        issue: 'CORS errors',
        solution: 'Ensure Web App is deployed with "Anyone" access'
      }
    ]
  };
}

/**
 * Display setup summary
 */
function displaySetupSummary() {
  const instructions = getSetupInstructions();
  console.log('=== ServesPlatform Setup Instructions ===');
  console.log(JSON.stringify(instructions, null, 2));
  return instructions;
}