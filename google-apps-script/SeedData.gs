/**
 * Seed Data Generator for ServesPlatform
 * Creates demo users, clients, and initial system configuration
 */

/**
 * Main function to populate the database with seed data
 * Run this function after setting up the database structure
 */
function populateSeedData() {
  try {
    console.log('Starting seed data population...');
    
    // Clear existing data (except headers)
    clearExistingData();
    
    // Create demo users and authentication data
    createDemoUsers();
    
    // Create sample client data
    createSampleClients();
    
    // Setup initial system configuration
    setupInitialConfiguration();
    
    console.log('Seed data population completed successfully!');
    
    return {
      success: true,
      message: 'Demo data created successfully',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error populating seed data:', error);
    throw error;
  }
}

/**
 * Clear existing data from all sheets (keep headers)
 */
function clearExistingData() {
  const sheetNames = [
    'Usuarios', 'Clientes', 'Proyectos', 'Actividades', 
    'Colaboradores', 'Asignaciones', 'Horas', 'Materiales', 'BOM'
  ];
  
  sheetNames.forEach(sheetName => {
    try {
      const sheet = getSheet(sheetName);
      const lastRow = sheet.getLastRow();
      
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
        console.log(`Cleared existing data from ${sheetName} sheet`);
      }
    } catch (error) {
      console.warn(`Could not clear ${sheetName} sheet:`, error.message);
    }
  });
}

/**
 * Create demo users with hashed passwords
 * Requirements: 1.1, 7.1
 */
function createDemoUsers() {
  console.log('Creating demo users...');
  
  const sheet = getSheet('Usuarios');
  
  const demoUsers = [
    {
      email: 'admin@servesplatform.com',
      nombre: 'Administrador Principal',
      rol: 'admin_lider',
      password: 'admin123'
    },
    {
      email: 'admin.sistemas@servesplatform.com',
      nombre: 'Admin de Sistemas',
      rol: 'admin',
      password: 'admin456'
    },
    {
      email: 'gerente.proyectos@servesplatform.com',
      nombre: 'María González',
      rol: 'editor',
      password: 'editor123'
    },
    {
      email: 'supervisor.campo@servesplatform.com',
      nombre: 'Carlos Rodríguez',
      rol: 'editor',
      password: 'editor456'
    },
    {
      email: 'tecnico.electricista@servesplatform.com',
      nombre: 'Juan Pérez',
      rol: 'tecnico',
      password: 'tecnico123'
    },
    {
      email: 'tecnico.civil@servesplatform.com',
      nombre: 'Ana López',
      rol: 'tecnico',
      password: 'tecnico456'
    }
  ];
  
  const userData = demoUsers.map(user => {
    const passwordHash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, 
      user.password, 
      Utilities.Charset.UTF_8
    ).map(byte => (byte + 256) % 256)
     .map(byte => byte.toString(16).padStart(2, '0'))
     .join('');
    
    return [
      generateId('Usuarios'),
      user.email,
      user.nombre,
      user.rol,
      passwordHash,
      'TRUE',
      new Date(),
      new Date()
    ];
  });
  
  sheet.getRange(2, 1, userData.length, 8).setValues(userData);
  console.log(`Created ${userData.length} demo users`);
}

/**
 * Create sample client data
 * Requirements: 1.1, 7.1
 */
function createSampleClients() {
  console.log('Creating sample clients...');
  
  const sheet = getSheet('Clientes');
  
  const sampleClients = [
    {
      ruc: '20123456789',
      razon_social: 'Constructora Lima Norte S.A.C.',
      nombre_comercial: 'Lima Norte Construcciones',
      direccion: 'Av. Túpac Amaru 1234, Lima',
      telefono: '01-234-5678',
      email: 'contacto@limanorte.com',
      contacto_principal: 'Roberto Silva'
    },
    {
      ruc: '20987654321',
      razon_social: 'Inmobiliaria San Isidro S.A.',
      nombre_comercial: 'San Isidro Properties',
      direccion: 'Av. Javier Prado 567, San Isidro',
      telefono: '01-876-5432',
      email: 'proyectos@sanisidro.com',
      contacto_principal: 'Patricia Mendoza'
    },
    {
      ruc: '20456789123',
      razon_social: 'Industrias Manufactureras del Perú S.A.',
      nombre_comercial: 'IMPESA',
      direccion: 'Av. Argentina 890, Callao',
      telefono: '01-345-6789',
      email: 'mantenimiento@impesa.com',
      contacto_principal: 'Miguel Torres'
    },
    {
      ruc: '20789123456',
      razon_social: 'Centro Comercial Plaza Norte S.A.C.',
      nombre_comercial: 'Plaza Norte',
      direccion: 'Av. Alfredo Mendiola 3698, Independencia',
      telefono: '01-567-8901',
      email: 'infraestructura@plazanorte.com',
      contacto_principal: 'Carmen Vásquez'
    },
    {
      ruc: '20321654987',
      razon_social: 'Hospital Nacional Dos de Mayo',
      nombre_comercial: 'Hospital Dos de Mayo',
      direccion: 'Av. Grau 13, Cercado de Lima',
      telefono: '01-432-1098',
      email: 'mantenimiento@hdm.gob.pe',
      contacto_principal: 'Dr. Fernando Castillo'
    }
  ];
  
  const clientData = sampleClients.map(client => [
    generateId('Clientes'),
    client.ruc,
    client.razon_social,
    client.nombre_comercial,
    client.direccion,
    client.telefono,
    client.email,
    client.contacto_principal,
    'TRUE',
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, clientData.length, 11).setValues(clientData);
  console.log(`Created ${clientData.length} sample clients`);
}

/**
 * Setup initial system configuration
 * Requirements: 1.1, 7.1
 */
function setupInitialConfiguration() {
  console.log('Setting up initial system configuration...');
  
  const configSheet = getSheet('Config');
  
  // Clear existing config
  const lastRow = configSheet.getLastRow();
  if (lastRow > 1) {
    configSheet.getRange(2, 1, lastRow - 1, 4).clearContent();
  }
  
  const configData = [
    ['timezone', 'America/Lima', 'Zona horaria del sistema', new Date()],
    ['currency_default', 'PEN', 'Moneda por defecto del sistema', new Date()],
    ['project_code_prefix', 'PRY-', 'Prefijo para códigos de proyecto', new Date()],
    ['activity_code_prefix', 'ACT-', 'Prefijo para códigos de actividad', new Date()],
    ['material_code_prefix', 'MAT-', 'Prefijo para códigos de material', new Date()],
    ['collaborator_code_prefix', 'COL-', 'Prefijo para códigos de colaborador', new Date()],
    ['sla_alert_days', '3', 'Días de anticipación para alertas de SLA', new Date()],
    ['stock_alert_threshold', '0.2', 'Umbral de alerta de stock (20% del mínimo)', new Date()],
    ['certification_alert_days', '30', 'Días de anticipación para alertas de certificación', new Date()],
    ['default_work_hours', '8', 'Horas de trabajo por día por defecto', new Date()],
    ['overtime_multiplier', '1.5', 'Multiplicador para horas extra', new Date()],
    ['night_shift_multiplier', '1.3', 'Multiplicador para turno nocturno', new Date()],
    ['holiday_multiplier', '2.0', 'Multiplicador para días feriados', new Date()],
    ['app_name', 'ServesPlatform', 'Nombre de la aplicación', new Date()],
    ['app_version', '1.0.0', 'Versión actual de la aplicación', new Date()],
    ['maintenance_mode', 'FALSE', 'Modo de mantenimiento del sistema', new Date()],
    ['max_file_upload_mb', '10', 'Tamaño máximo de archivo en MB', new Date()],
    ['session_timeout_hours', '24', 'Tiempo de expiración de sesión en horas', new Date()],
    ['backup_frequency_days', '7', 'Frecuencia de respaldo en días', new Date()],
    ['audit_log_retention_days', '90', 'Días de retención de logs de auditoría', new Date()]
  ];
  
  configSheet.getRange(2, 1, configData.length, 4).setValues(configData);
  console.log(`Created ${configData.length} system configuration entries`);
  
  // Setup default checklists
  setupDefaultChecklists();
}

/**
 * Setup default checklists for different service lines
 */
function setupDefaultChecklists() {
  console.log('Setting up default checklists...');
  
  const checklistSheet = getSheet('Checklists');
  
  // Clear existing checklists
  const lastRow = checklistSheet.getLastRow();
  if (lastRow > 1) {
    checklistSheet.getRange(2, 1, lastRow - 1, checklistSheet.getLastColumn()).clearContent();
  }
  
  const defaultChecklists = [
    {
      nombre: 'Instalación Eléctrica Básica',
      descripcion: 'Checklist para instalaciones eléctricas residenciales y comerciales',
      categoria: 'Eléctrico',
      items: [
        { item: 'Verificar planos eléctricos aprobados', obligatorio: true },
        { item: 'Inspeccionar materiales y herramientas', obligatorio: true },
        { item: 'Verificar corte de energía en zona de trabajo', obligatorio: true },
        { item: 'Instalar canaletas y tuberías', obligatorio: true },
        { item: 'Tender cableado según especificaciones', obligatorio: true },
        { item: 'Instalar tableros y breakers', obligatorio: true },
        { item: 'Conectar puntos de luz y tomacorrientes', obligatorio: true },
        { item: 'Realizar pruebas de continuidad', obligatorio: true },
        { item: 'Verificar puesta a tierra', obligatorio: true },
        { item: 'Documentar instalación con fotografías', obligatorio: false }
      ]
    },
    {
      nombre: 'Mantenimiento Preventivo CCTV',
      descripcion: 'Checklist para mantenimiento de sistemas de videovigilancia',
      categoria: 'CCTV',
      items: [
        { item: 'Limpiar lentes de cámaras', obligatorio: true },
        { item: 'Verificar enfoque y zoom', obligatorio: true },
        { item: 'Revisar conexiones de alimentación', obligatorio: true },
        { item: 'Probar grabación en DVR/NVR', obligatorio: true },
        { item: 'Verificar espacio de almacenamiento', obligatorio: true },
        { item: 'Revisar calidad de imagen nocturna', obligatorio: true },
        { item: 'Actualizar firmware si es necesario', obligatorio: false },
        { item: 'Documentar estado de cada cámara', obligatorio: true }
      ]
    },
    {
      nombre: 'Obra Civil - Acabados',
      descripcion: 'Checklist para trabajos de acabados en construcción',
      categoria: 'Civil',
      items: [
        { item: 'Verificar nivelación de superficies', obligatorio: true },
        { item: 'Preparar superficie (limpieza, imprimación)', obligatorio: true },
        { item: 'Verificar materiales según especificaciones', obligatorio: true },
        { item: 'Aplicar primera capa según técnica', obligatorio: true },
        { item: 'Respetar tiempos de secado', obligatorio: true },
        { item: 'Aplicar capas adicionales si es necesario', obligatorio: true },
        { item: 'Realizar acabado final', obligatorio: true },
        { item: 'Limpiar área de trabajo', obligatorio: true },
        { item: 'Documentar trabajo realizado', obligatorio: true }
      ]
    }
  ];
  
  const checklistData = defaultChecklists.map(checklist => [
    generateId('Checklists'),
    checklist.nombre,
    checklist.descripcion,
    checklist.categoria,
    JSON.stringify(checklist.items),
    'TRUE',
    new Date(),
    new Date()
  ]);
  
  checklistSheet.getRange(2, 1, checklistData.length, 8).setValues(checklistData);
  console.log(`Created ${checklistData.length} default checklists`);
}

/**
 * Generate unique ID with table prefix
 */
function generateId(tableName) {
  const prefixes = {
    'Usuarios': 'USR',
    'Clientes': 'CLI',
    'Proyectos': 'PRY',
    'Actividades': 'ACT',
    'Colaboradores': 'COL',
    'Asignaciones': 'ASG',
    'Horas': 'HOR',
    'Materiales': 'MAT',
    'BOM': 'BOM',
    'Checklists': 'CHK',
    'Config': 'CFG'
  };
  
  const prefix = prefixes[tableName] || 'GEN';
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}_${timestamp.toString(36).toUpperCase()}${random}`;
}

/**
 * Get demo user credentials for testing
 */
function getDemoCredentials() {
  return {
    admin_lider: {
      email: 'admin@servesplatform.com',
      password: 'admin123',
      nombre: 'Administrador Principal'
    },
    admin: {
      email: 'admin.sistemas@servesplatform.com',
      password: 'admin456',
      nombre: 'Admin de Sistemas'
    },
    editor: {
      email: 'gerente.proyectos@servesplatform.com',
      password: 'editor123',
      nombre: 'María González'
    },
    tecnico: {
      email: 'tecnico.electricista@servesplatform.com',
      password: 'tecnico123',
      nombre: 'Juan Pérez'
    }
  };
}

/**
 * Test authentication with demo users
 */
function testDemoAuthentication() {
  console.log('Testing demo user authentication...');
  
  const credentials = getDemoCredentials();
  const results = {};
  
  Object.keys(credentials).forEach(role => {
    try {
      const user = credentials[role];
      
      // Simulate authentication request
      const mockEvent = {
        postData: {
          contents: JSON.stringify({
            action: 'auth',
            email: user.email,
            password: user.password,
            token: CONFIG.API_TOKEN
          })
        }
      };
      
      const response = handleAuth(mockEvent);
      const responseData = JSON.parse(response.getContent());
      
      results[role] = {
        success: responseData.ok,
        user: responseData.data?.user || null,
        jwt: responseData.data?.jwt ? 'Generated' : null
      };
      
    } catch (error) {
      results[role] = {
        success: false,
        error: error.message
      };
    }
  });
  
  console.log('Authentication test results:', results);
  return results;
}