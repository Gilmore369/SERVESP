/**
 * ServesPlatform Sample Data Generator - STANDARDIZED VERSION
 * Creates comprehensive, realistic sample data for testing
 * Requirements: 2.5
 */

/**
 * Main function to populate the database with comprehensive sample data
 * Run this function after setting up the database structure
 */
function populateComprehensiveSampleData() {
  try {
    console.log('Starting comprehensive sample data population...');
    
    // Clear existing data (except headers)
    clearExistingData();
    
    // Create sample data in dependency order
    const users = createSampleUsers();
    const clients = createSampleClients();
    const collaborators = createSampleCollaborators();
    const materials = createSampleMaterials();
    const checklists = createSampleChecklists();
    const projects = createSampleProjects(clients, users);
    const activities = createSampleActivities(projects, users, checklists);
    const assignments = createSampleAssignments(collaborators, activities, projects);
    const timeEntries = createSampleTimeEntries(collaborators, activities, projects);
    const bomEntries = createSampleBOMEntries(activities, projects, materials);
    const evidences = createSampleEvidences(activities, projects, users);
    const documents = createSampleDocuments(projects, users);
    
    // Setup system configuration
    setupSystemConfiguration();
    
    // Create activity checklists
    createSampleActivityChecklists(activities, checklists);
    
    console.log('Comprehensive sample data population completed successfully!');
    
    return {
      success: true,
      message: 'Comprehensive sample data created successfully',
      summary: {
        users: users.length,
        clients: clients.length,
        collaborators: collaborators.length,
        materials: materials.length,
        checklists: checklists.length,
        projects: projects.length,
        activities: activities.length,
        assignments: assignments.length,
        time_entries: timeEntries.length,
        bom_entries: bomEntries.length,
        evidences: evidences.length,
        documents: documents.length
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error populating comprehensive sample data:', error);
    throw error;
  }
}

/**
 * Clear existing data from all sheets (keep headers)
 * Requirements: 2.5
 */
function clearExistingData() {
  const sheetNames = [
    'Usuarios', 'Clientes', 'Proyectos', 'Actividades', 'Colaboradores', 
    'Asignaciones', 'Horas', 'Materiales', 'BOM', 'Checklists',
    'ActivityChecklists', 'Evidencias', 'Documentos', 'Config'
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
 * Create comprehensive sample users with different roles
 * Requirements: 2.5
 */
function createSampleUsers() {
  console.log('Creating sample users...');
  
  const sheet = getSheet('Usuarios');
  
  const sampleUsers = [
    {
      email: 'admin@servesplatform.com',
      nombre: 'Administrador Principal',
      rol: 'admin_lider',
      password: 'admin123'
    },
    {
      email: 'admin.sistemas@servesplatform.com',
      nombre: 'Carlos Mendoza',
      rol: 'admin',
      password: 'admin456'
    },
    {
      email: 'gerente.proyectos@servesplatform.com',
      nombre: 'María González Ruiz',
      rol: 'editor',
      password: 'editor123'
    },
    {
      email: 'supervisor.campo@servesplatform.com',
      nombre: 'Roberto Silva Vargas',
      rol: 'editor',
      password: 'editor456'
    },
    {
      email: 'ingeniero.electricista@servesplatform.com',
      nombre: 'Ana López Torres',
      rol: 'editor',
      password: 'editor789'
    },
    {
      email: 'tecnico.senior@servesplatform.com',
      nombre: 'Juan Pérez Morales',
      rol: 'tecnico',
      password: 'tecnico123'
    },
    {
      email: 'tecnico.civil@servesplatform.com',
      nombre: 'Carmen Vásquez Luna',
      rol: 'tecnico',
      password: 'tecnico456'
    },
    {
      email: 'tecnico.cctv@servesplatform.com',
      nombre: 'Diego Ramírez Castro',
      rol: 'tecnico',
      password: 'tecnico789'
    }
  ];
  
  const userData = sampleUsers.map(user => {
    const passwordHash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, 
      user.password, 
      Utilities.Charset.UTF_8
    ).map(byte => (byte + 256) % 256)
     .map(byte => byte.toString(16).padStart(2, '0'))
     .join('');
    
    return [
      generateId('USR'),
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
  console.log(`Created ${userData.length} sample users`);
  
  return userData.map((row, index) => ({
    id: row[0],
    email: row[1],
    nombre: row[2],
    rol: row[3]
  }));
}

/**
 * Create diverse sample clients representing different industries
 * Requirements: 2.5
 */
function createSampleClients() {
  console.log('Creating sample clients...');
  
  const sheet = getSheet('Clientes');
  
  const sampleClients = [
    {
      ruc: '20123456789',
      razon_social: 'Constructora Lima Norte S.A.C.',
      nombre_comercial: 'Lima Norte Construcciones',
      direccion: 'Av. Túpac Amaru 1234, Los Olivos, Lima',
      telefono: '01-234-5678',
      email: 'contacto@limanorte.com',
      contacto_principal: 'Roberto Silva Mendoza'
    },
    {
      ruc: '20987654321',
      razon_social: 'Inmobiliaria San Isidro S.A.',
      nombre_comercial: 'San Isidro Properties',
      direccion: 'Av. Javier Prado Este 567, San Isidro, Lima',
      telefono: '01-876-5432',
      email: 'proyectos@sanisidro.com',
      contacto_principal: 'Patricia Mendoza Vega'
    },
    {
      ruc: '20456789123',
      razon_social: 'Industrias Manufactureras del Perú S.A.',
      nombre_comercial: 'IMPESA',
      direccion: 'Av. Argentina 890, Callao',
      telefono: '01-345-6789',
      email: 'mantenimiento@impesa.com',
      contacto_principal: 'Miguel Torres Castillo'
    },
    {
      ruc: '20789123456',
      razon_social: 'Centro Comercial Plaza Norte S.A.C.',
      nombre_comercial: 'Plaza Norte',
      direccion: 'Av. Alfredo Mendiola 3698, Independencia, Lima',
      telefono: '01-567-8901',
      email: 'infraestructura@plazanorte.com',
      contacto_principal: 'Carmen Vásquez López'
    },
    {
      ruc: '20321654987',
      razon_social: 'Hospital Nacional Dos de Mayo',
      nombre_comercial: 'Hospital Dos de Mayo',
      direccion: 'Av. Grau 13, Cercado de Lima',
      telefono: '01-432-1098',
      email: 'mantenimiento@hdm.gob.pe',
      contacto_principal: 'Dr. Fernando Castillo Ruiz'
    },
    {
      ruc: '20654321098',
      razon_social: 'Universidad Nacional de Ingeniería',
      nombre_comercial: 'UNI',
      direccion: 'Av. Túpac Amaru 210, Rímac, Lima',
      telefono: '01-381-3800',
      email: 'infraestructura@uni.edu.pe',
      contacto_principal: 'Ing. Carlos Rodríguez Pérez'
    },
    {
      ruc: '20111222333',
      razon_social: 'Supermercados Metro S.A.',
      nombre_comercial: 'Metro',
      direccion: 'Av. Canaval y Moreyra 150, San Isidro, Lima',
      telefono: '01-215-9000',
      email: 'mantenimiento@metro.pe',
      contacto_principal: 'Luis García Morales'
    },
    {
      ruc: '20444555666',
      razon_social: 'Banco de Crédito del Perú',
      nombre_comercial: 'BCP',
      direccion: 'Centenario 156, La Molina, Lima',
      telefono: '01-313-2000',
      email: 'infraestructura@viabcp.com',
      contacto_principal: 'Sandra Flores Vega'
    }
  ];
  
  const clientData = sampleClients.map(client => [
    generateId('CLI'),
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
  
  return clientData.map((row, index) => ({
    id: row[0],
    ruc: row[1],
    razon_social: row[2],
    nombre_comercial: row[3]
  }));
}

/**
 * Create sample collaborators with diverse skills and certifications
 * Requirements: 2.5
 */
function createSampleCollaborators() {
  console.log('Creating sample collaborators...');
  
  const sheet = getSheet('Colaboradores');
  
  const sampleCollaborators = [
    {
      dni_ruc: '12345678',
      nombres: 'Juan Carlos Pérez López',
      telefono: '987654321',
      email: 'juan.perez@email.com',
      especialidad: 'Electricista',
      tarifa_hora: 25.50,
      zona: 'Lima Centro',
      certificaciones: [
        {"tipo": "Certificación Eléctrica CNO", "vencimiento": "2025-12-31"},
        {"tipo": "Seguridad Industrial", "vencimiento": "2025-06-30"}
      ]
    },
    {
      dni_ruc: '87654321',
      nombres: 'María Elena Rodríguez Vega',
      telefono: '987654322',
      email: 'maria.rodriguez@email.com',
      especialidad: 'Técnico Civil',
      tarifa_hora: 22.00,
      zona: 'Lima Norte',
      certificaciones: [
        {"tipo": "Técnico en Construcción", "vencimiento": "2025-08-15"},
        {"tipo": "Manejo de Equipos", "vencimiento": "2025-10-20"}
      ]
    },
    {
      dni_ruc: '11223344',
      nombres: 'Carlos Alberto Mendoza Silva',
      telefono: '987654323',
      email: 'carlos.mendoza@email.com',
      especialidad: 'Técnico CCTV',
      tarifa_hora: 28.00,
      zona: 'Lima Este',
      certificaciones: [
        {"tipo": "Certificación CCTV Avanzado", "vencimiento": "2025-11-30"},
        {"tipo": "Redes y Telecomunicaciones", "vencimiento": "2025-09-15"}
      ]
    },
    {
      dni_ruc: '55667788',
      nombres: 'Ana Lucía Torres Castillo',
      telefono: '987654324',
      email: 'ana.torres@email.com',
      especialidad: 'Supervisor',
      tarifa_hora: 35.00,
      zona: 'Lima Sur',
      certificaciones: [
        {"tipo": "Supervisión de Obras", "vencimiento": "2025-07-20"},
        {"tipo": "Gestión de Proyectos", "vencimiento": "2025-12-10"}
      ]
    },
    {
      dni_ruc: '99887766',
      nombres: 'Roberto Alejandro Vargas Luna',
      telefono: '987654325',
      email: 'roberto.vargas@email.com',
      especialidad: 'Mantenimiento',
      tarifa_hora: 24.00,
      zona: 'Callao',
      certificaciones: [
        {"tipo": "Mantenimiento Industrial", "vencimiento": "2025-05-25"},
        {"tipo": "Soldadura Certificada", "vencimiento": "2025-08-30"}
      ]
    },
    {
      dni_ruc: '33445566',
      nombres: 'Patricia Isabel Flores Morales',
      telefono: '987654326',
      email: 'patricia.flores@email.com',
      especialidad: 'Ingeniero',
      tarifa_hora: 45.00,
      zona: 'Lima Centro',
      certificaciones: [
        {"tipo": "Colegio de Ingenieros", "vencimiento": "2025-12-31"},
        {"tipo": "Especialización en Automatización", "vencimiento": "2025-09-30"}
      ]
    },
    {
      dni_ruc: '77889900',
      nombres: 'Diego Fernando Ramírez Castro',
      telefono: '987654327',
      email: 'diego.ramirez@email.com',
      especialidad: 'Electricista',
      tarifa_hora: 26.50,
      zona: 'Lima Norte',
      certificaciones: [
        {"tipo": "Electricidad Industrial", "vencimiento": "2025-06-15"},
        {"tipo": "Tableros de Control", "vencimiento": "2025-11-20"}
      ]
    },
    {
      dni_ruc: '22334455',
      nombres: 'Carmen Rosa Vásquez Herrera',
      telefono: '987654328',
      email: 'carmen.vasquez@email.com',
      especialidad: 'Técnico Civil',
      tarifa_hora: 23.50,
      zona: 'Provincias',
      certificaciones: [
        {"tipo": "Topografía", "vencimiento": "2025-04-30"},
        {"tipo": "Control de Calidad", "vencimiento": "2025-10-15"}
      ]
    }
  ];
  
  const collaboratorData = sampleCollaborators.map(collab => [
    generateId('COL'),
    collab.dni_ruc,
    collab.nombres,
    collab.telefono,
    collab.email,
    collab.especialidad,
    collab.tarifa_hora,
    collab.zona,
    JSON.stringify(collab.certificaciones),
    'TRUE',
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, collaboratorData.length, 12).setValues(collaboratorData);
  console.log(`Created ${collaboratorData.length} sample collaborators`);
  
  return collaboratorData.map((row, index) => ({
    id: row[0],
    dni_ruc: row[1],
    nombres: row[2],
    especialidad: row[5]
  }));
}

/**
 * Create comprehensive sample materials inventory
 * Requirements: 2.5
 */
function createSampleMaterials() {
  console.log('Creating sample materials...');
  
  const sheet = getSheet('Materiales');
  
  const sampleMaterials = [
    // Electrical materials
    {
      sku: 'CBL-001',
      descripcion: 'Cable THW 12 AWG - 600V',
      categoria: 'Cables',
      unidad: 'Metro',
      costo_ref: 2.50,
      stock_actual: 500,
      stock_minimo: 100,
      proveedor_principal: 'Cables del Perú S.A.',
      ubicacion_almacen: 'Almacén A-1'
    },
    {
      sku: 'CBL-002',
      descripcion: 'Cable THW 14 AWG - 600V',
      categoria: 'Cables',
      unidad: 'Metro',
      costo_ref: 1.80,
      stock_actual: 300,
      stock_minimo: 80,
      proveedor_principal: 'Cables del Perú S.A.',
      ubicacion_almacen: 'Almacén A-1'
    },
    {
      sku: 'CNT-001',
      descripcion: 'Conector MC4 Macho',
      categoria: 'Conectores',
      unidad: 'Unidad',
      costo_ref: 15.00,
      stock_actual: 50,
      stock_minimo: 20,
      proveedor_principal: 'Conectores XYZ S.A.C.',
      ubicacion_almacen: 'Almacén B-2'
    },
    {
      sku: 'CNT-002',
      descripcion: 'Conector MC4 Hembra',
      categoria: 'Conectores',
      unidad: 'Unidad',
      costo_ref: 15.00,
      stock_actual: 45,
      stock_minimo: 20,
      proveedor_principal: 'Conectores XYZ S.A.C.',
      ubicacion_almacen: 'Almacén B-2'
    },
    {
      sku: 'INT-001',
      descripcion: 'Interruptor Simple 15A',
      categoria: 'Equipos',
      unidad: 'Unidad',
      costo_ref: 8.50,
      stock_actual: 75,
      stock_minimo: 25,
      proveedor_principal: 'Ticino Perú',
      ubicacion_almacen: 'Almacén B-3'
    },
    {
      sku: 'INT-002',
      descripcion: 'Interruptor Doble 15A',
      categoria: 'Equipos',
      unidad: 'Unidad',
      costo_ref: 12.00,
      stock_actual: 60,
      stock_minimo: 20,
      proveedor_principal: 'Ticino Perú',
      ubicacion_almacen: 'Almacén B-3'
    },
    // Tools and equipment
    {
      sku: 'HER-001',
      descripcion: 'Multímetro Digital Fluke 117',
      categoria: 'Herramientas',
      unidad: 'Unidad',
      costo_ref: 450.00,
      stock_actual: 8,
      stock_minimo: 3,
      proveedor_principal: 'Instrumentos Técnicos',
      ubicacion_almacen: 'Almacén C-1'
    },
    {
      sku: 'HER-002',
      descripcion: 'Taladro Percutor 1/2" Bosch',
      categoria: 'Herramientas',
      unidad: 'Unidad',
      costo_ref: 280.00,
      stock_actual: 5,
      stock_minimo: 2,
      proveedor_principal: 'Bosch Perú',
      ubicacion_almacen: 'Almacén C-1'
    },
    // Safety equipment
    {
      sku: 'SEG-001',
      descripcion: 'Casco de Seguridad Blanco',
      categoria: 'Seguridad',
      unidad: 'Unidad',
      costo_ref: 25.00,
      stock_actual: 30,
      stock_minimo: 15,
      proveedor_principal: 'Seguridad Industrial SAC',
      ubicacion_almacen: 'Almacén D-1'
    },
    {
      sku: 'SEG-002',
      descripcion: 'Guantes Dieléctricos Clase 0',
      categoria: 'Seguridad',
      unidad: 'Par',
      costo_ref: 85.00,
      stock_actual: 12,
      stock_minimo: 8,
      proveedor_principal: 'Seguridad Industrial SAC',
      ubicacion_almacen: 'Almacén D-1'
    },
    // Consumables - some with low stock for testing alerts
    {
      sku: 'CON-001',
      descripcion: 'Cinta Aislante 3M Negra',
      categoria: 'Consumibles',
      unidad: 'Rollo',
      costo_ref: 8.50,
      stock_actual: 5,
      stock_minimo: 20,
      proveedor_principal: '3M Perú',
      ubicacion_almacen: 'Almacén E-1'
    },
    {
      sku: 'CON-002',
      descripcion: 'Tornillos Autorroscantes 1/4"',
      categoria: 'Consumibles',
      unidad: 'Caja',
      costo_ref: 12.00,
      stock_actual: 2,
      stock_minimo: 10,
      proveedor_principal: 'Ferretería Central',
      ubicacion_almacen: 'Almacén E-2'
    }
  ];
  
  const materialData = sampleMaterials.map(material => [
    generateId('MAT'),
    material.sku,
    material.descripcion,
    material.categoria,
    material.unidad,
    material.costo_ref,
    material.stock_actual,
    material.stock_minimo,
    material.proveedor_principal,
    material.ubicacion_almacen,
    'TRUE',
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, materialData.length, 13).setValues(materialData);
  console.log(`Created ${materialData.length} sample materials`);
  
  return materialData.map((row, index) => ({
    id: row[0],
    sku: row[1],
    descripcion: row[2],
    categoria: row[3]
  }));
}/**

 * Create sample checklists for different service lines
 * Requirements: 2.5
 */
function createSampleChecklists() {
  console.log('Creating sample checklists...');
  
  const sheet = getSheet('Checklists');
  
  const sampleChecklists = [
    {
      nombre: 'Instalación Eléctrica Residencial',
      descripcion: 'Checklist completo para instalaciones eléctricas en viviendas',
      categoria: 'Eléctrico',
      items: [
        { item: 'Verificar planos eléctricos aprobados por municipalidad', obligatorio: true },
        { item: 'Inspeccionar materiales según especificaciones técnicas', obligatorio: true },
        { item: 'Verificar corte de energía en zona de trabajo', obligatorio: true },
        { item: 'Instalar canaletas y tuberías según normativa', obligatorio: true },
        { item: 'Tender cableado respetando código de colores', obligatorio: true },
        { item: 'Instalar tableros eléctricos y breakers', obligatorio: true },
        { item: 'Conectar puntos de luz y tomacorrientes', obligatorio: true },
        { item: 'Realizar pruebas de continuidad en todos los circuitos', obligatorio: true },
        { item: 'Verificar sistema de puesta a tierra', obligatorio: true },
        { item: 'Medir resistencia de aislamiento', obligatorio: true },
        { item: 'Documentar instalación con fotografías', obligatorio: false },
        { item: 'Entregar certificado de conformidad', obligatorio: true }
      ]
    },
    {
      nombre: 'Mantenimiento Preventivo CCTV',
      descripcion: 'Checklist para mantenimiento de sistemas de videovigilancia',
      categoria: 'CCTV',
      items: [
        { item: 'Limpiar lentes de cámaras con productos especializados', obligatorio: true },
        { item: 'Verificar enfoque y zoom de cada cámara', obligatorio: true },
        { item: 'Revisar conexiones de alimentación y datos', obligatorio: true },
        { item: 'Probar grabación en DVR/NVR', obligatorio: true },
        { item: 'Verificar espacio de almacenamiento disponible', obligatorio: true },
        { item: 'Revisar calidad de imagen diurna y nocturna', obligatorio: true },
        { item: 'Verificar funcionamiento de infrarrojos', obligatorio: true },
        { item: 'Probar detección de movimiento', obligatorio: true },
        { item: 'Actualizar firmware si es necesario', obligatorio: false },
        { item: 'Verificar acceso remoto', obligatorio: true },
        { item: 'Documentar estado de cada cámara', obligatorio: true },
        { item: 'Generar reporte de mantenimiento', obligatorio: true }
      ]
    },
    {
      nombre: 'Obra Civil - Acabados Interiores',
      descripcion: 'Checklist para trabajos de acabados en construcción',
      categoria: 'Civil',
      items: [
        { item: 'Verificar nivelación de superficies', obligatorio: true },
        { item: 'Revisar humedad de paredes y techos', obligatorio: true },
        { item: 'Preparar superficie (limpieza, lijado, imprimación)', obligatorio: true },
        { item: 'Verificar materiales según especificaciones', obligatorio: true },
        { item: 'Aplicar primera capa según técnica especificada', obligatorio: true },
        { item: 'Respetar tiempos de secado recomendados', obligatorio: true },
        { item: 'Aplicar capas adicionales según necesidad', obligatorio: true },
        { item: 'Realizar acabado final con herramientas adecuadas', obligatorio: true },
        { item: 'Verificar uniformidad de color y textura', obligatorio: true },
        { item: 'Limpiar área de trabajo', obligatorio: true },
        { item: 'Proteger superficies terminadas', obligatorio: false },
        { item: 'Documentar trabajo realizado con fotografías', obligatorio: true }
      ]
    },
    {
      nombre: 'Mantenimiento Preventivo Industrial',
      descripcion: 'Checklist para mantenimiento de equipos industriales',
      categoria: 'Mantenimiento',
      items: [
        { item: 'Verificar estado de motores eléctricos', obligatorio: true },
        { item: 'Revisar conexiones eléctricas y apriete', obligatorio: true },
        { item: 'Lubricar rodamientos y partes móviles', obligatorio: true },
        { item: 'Verificar alineación de equipos', obligatorio: true },
        { item: 'Revisar estado de correas y poleas', obligatorio: true },
        { item: 'Medir vibraciones en puntos críticos', obligatorio: true },
        { item: 'Verificar temperatura de operación', obligatorio: true },
        { item: 'Revisar sistema de refrigeración', obligatorio: true },
        { item: 'Limpiar filtros y rejillas de ventilación', obligatorio: true },
        { item: 'Verificar funcionamiento de sistemas de seguridad', obligatorio: true },
        { item: 'Actualizar registro de mantenimiento', obligatorio: true },
        { item: 'Programar próximo mantenimiento', obligatorio: true }
      ]
    },
    {
      nombre: 'Instalación Sistema Seguridad',
      descripcion: 'Checklist para instalación de sistemas de seguridad integral',
      categoria: 'Seguridad',
      items: [
        { item: 'Verificar planos de seguridad aprobados', obligatorio: true },
        { item: 'Instalar sensores de movimiento en puntos estratégicos', obligatorio: true },
        { item: 'Configurar central de alarmas', obligatorio: true },
        { item: 'Instalar sirenas interiores y exteriores', obligatorio: true },
        { item: 'Configurar códigos de usuario', obligatorio: true },
        { item: 'Probar comunicación con central de monitoreo', obligatorio: true },
        { item: 'Verificar respaldo de energía (UPS)', obligatorio: true },
        { item: 'Realizar pruebas de todos los sensores', obligatorio: true },
        { item: 'Capacitar al usuario final', obligatorio: true },
        { item: 'Entregar manual de operación', obligatorio: true },
        { item: 'Documentar configuración del sistema', obligatorio: true }
      ]
    }
  ];
  
  const checklistData = sampleChecklists.map(checklist => [
    generateId('CHK'),
    checklist.nombre,
    checklist.descripcion,
    checklist.categoria,
    JSON.stringify(checklist.items),
    'TRUE',
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, checklistData.length, 8).setValues(checklistData);
  console.log(`Created ${checklistData.length} sample checklists`);
  
  return checklistData.map((row, index) => ({
    id: row[0],
    nombre: row[1],
    categoria: row[3]
  }));
}

/**
 * Create sample projects with realistic scenarios
 * Requirements: 2.5
 */
function createSampleProjects(clients, users) {
  console.log('Creating sample projects...');
  
  const sheet = getSheet('Proyectos');
  
  // Get some users for assignment as project managers
  const projectManagers = users.filter(user => user.rol === 'editor' || user.rol === 'admin');
  
  const sampleProjects = [
    {
      codigo: 'PRY-2024-001',
      nombre: 'Instalación Sistema Eléctrico - Edificio Corporativo',
      cliente_id: clients[1].id, // San Isidro Properties
      responsable_id: projectManagers[0].id,
      ubicacion: 'San Isidro, Lima',
      descripcion: 'Instalación completa del sistema eléctrico para edificio corporativo de 8 pisos, incluyendo tableros, cableado, iluminación y sistema de emergencia.',
      linea_servicio: 'Eléctrico',
      inicio_plan: new Date(),
      fin_plan: new Date(Date.now() + 60*24*60*60*1000), // 60 days
      presupuesto_total: 85000,
      moneda: 'PEN',
      estado: 'En progreso',
      avance_pct: 35
    },
    {
      codigo: 'PRY-2024-002',
      nombre: 'Mantenimiento Preventivo - Centro Comercial',
      cliente_id: clients[3].id, // Plaza Norte
      responsable_id: projectManagers[1].id,
      ubicacion: 'Independencia, Lima',
      descripcion: 'Programa de mantenimiento preventivo trimestral para sistemas eléctricos, CCTV y climatización del centro comercial.',
      linea_servicio: 'Mantenimiento',
      inicio_plan: new Date(Date.now() - 15*24*60*60*1000), // Started 15 days ago
      fin_plan: new Date(Date.now() + 75*24*60*60*1000), // 75 days from now
      presupuesto_total: 45000,
      moneda: 'PEN',
      estado: 'En progreso',
      avance_pct: 60
    },
    {
      codigo: 'PRY-2024-003',
      nombre: 'Instalación CCTV - Hospital Nacional',
      cliente_id: clients[4].id, // Hospital Dos de Mayo
      responsable_id: projectManagers[2].id,
      ubicacion: 'Cercado de Lima',
      descripcion: 'Instalación de sistema de videovigilancia con 48 cámaras IP, incluyendo centro de monitoreo y grabación por 30 días.',
      linea_servicio: 'CCTV',
      inicio_plan: new Date(Date.now() + 7*24*60*60*1000), // Starts in 7 days
      fin_plan: new Date(Date.now() + 45*24*60*60*1000), // 45 days from now
      presupuesto_total: 120000,
      moneda: 'PEN',
      estado: 'Planificación',
      avance_pct: 0
    },
    {
      codigo: 'PRY-2024-004',
      nombre: 'Remodelación Eléctrica - Universidad',
      cliente_id: clients[5].id, // UNI
      responsable_id: projectManagers[0].id,
      ubicacion: 'Rímac, Lima',
      descripcion: 'Remodelación completa del sistema eléctrico de 3 pabellones universitarios, incluyendo laboratorios y aulas.',
      linea_servicio: 'Eléctrico',
      inicio_plan: new Date(Date.now() - 30*24*60*60*1000), // Started 30 days ago
      fin_plan: new Date(Date.now() + 30*24*60*60*1000), // 30 days from now
      presupuesto_total: 95000,
      moneda: 'PEN',
      estado: 'En progreso',
      avance_pct: 75
    },
    {
      codigo: 'PRY-2024-005',
      nombre: 'Instalación Telecomunicaciones - Sucursal Bancaria',
      cliente_id: clients[7].id, // BCP
      responsable_id: projectManagers[1].id,
      ubicacion: 'La Molina, Lima',
      descripcion: 'Instalación de infraestructura de telecomunicaciones para nueva sucursal bancaria, incluyendo red de datos y telefonía.',
      linea_servicio: 'Telecomunicaciones',
      inicio_plan: new Date(Date.now() + 14*24*60*60*1000), // Starts in 14 days
      fin_plan: new Date(Date.now() + 44*24*60*60*1000), // 44 days from now
      presupuesto_total: 35000,
      moneda: 'PEN',
      estado: 'Planificación',
      avance_pct: 0
    },
    {
      codigo: 'PRY-2024-006',
      nombre: 'Mantenimiento Industrial - Planta Manufacturera',
      cliente_id: clients[2].id, // IMPESA
      responsable_id: projectManagers[2].id,
      ubicacion: 'Callao',
      descripcion: 'Mantenimiento correctivo y preventivo de sistemas eléctricos industriales, incluyendo motores, tableros y sistemas de control.',
      linea_servicio: 'Mantenimiento',
      inicio_plan: new Date(Date.now() - 10*24*60*60*1000), // Started 10 days ago
      fin_plan: new Date(Date.now() + 20*24*60*60*1000), // 20 days from now
      presupuesto_total: 65000,
      moneda: 'PEN',
      estado: 'En progreso',
      avance_pct: 40
    }
  ];
  
  const projectData = sampleProjects.map(project => [
    generateId('PRY'),
    project.codigo,
    project.nombre,
    project.cliente_id,
    project.responsable_id,
    project.ubicacion,
    project.descripcion,
    project.linea_servicio,
    project.inicio_plan,
    project.fin_plan,
    project.presupuesto_total,
    project.moneda,
    project.estado,
    project.avance_pct,
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, projectData.length, 16).setValues(projectData);
  console.log(`Created ${projectData.length} sample projects`);
  
  return projectData.map((row, index) => ({
    id: row[0],
    codigo: row[1],
    nombre: row[2],
    cliente_id: row[3],
    responsable_id: row[4],
    linea_servicio: row[7],
    estado: row[12]
  }));
}

/**
 * Create sample activities for projects
 * Requirements: 2.5
 */
function createSampleActivities(projects, users, checklists) {
  console.log('Creating sample activities...');
  
  const sheet = getSheet('Actividades');
  
  const technicalUsers = users.filter(user => user.rol === 'tecnico' || user.rol === 'editor');
  
  const sampleActivities = [];
  
  // Create activities for each project
  projects.forEach((project, projectIndex) => {
    const baseActivities = getActivitiesForServiceLine(project.linea_servicio, project.id, technicalUsers, checklists);
    sampleActivities.push(...baseActivities);
  });
  
  const activityData = sampleActivities.map(activity => [
    generateId('ACT'),
    activity.proyecto_id,
    activity.codigo,
    activity.titulo,
    activity.descripcion,
    activity.responsable_id,
    activity.prioridad,
    activity.estado,
    activity.inicio_plan,
    activity.fin_plan,
    activity.checklist_id,
    activity.porcentaje_avance,
    activity.evidencias_urls || '',
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, activityData.length, 15).setValues(activityData);
  console.log(`Created ${activityData.length} sample activities`);
  
  return activityData.map((row, index) => ({
    id: row[0],
    proyecto_id: row[1],
    codigo: row[2],
    titulo: row[3],
    responsable_id: row[5],
    estado: row[7]
  }));
}

/**
 * Generate activities based on service line
 * Requirements: 2.5
 */
function getActivitiesForServiceLine(serviceType, projectId, users, checklists) {
  const activities = [];
  const baseDate = new Date();
  
  switch (serviceType) {
    case 'Eléctrico':
      activities.push(
        {
          proyecto_id: projectId,
          codigo: 'ACT-001',
          titulo: 'Análisis de Planos y Especificaciones',
          descripcion: 'Revisión detallada de planos eléctricos y especificaciones técnicas del proyecto',
          responsable_id: users[Math.floor(Math.random() * users.length)].id,
          prioridad: 'Alta',
          estado: 'Completada',
          inicio_plan: new Date(baseDate.getTime() - 5*24*60*60*1000),
          fin_plan: new Date(baseDate.getTime() - 3*24*60*60*1000),
          checklist_id: checklists.find(c => c.categoria === 'Eléctrico')?.id || null,
          porcentaje_avance: 100
        },
        {
          proyecto_id: projectId,
          codigo: 'ACT-002',
          titulo: 'Instalación de Tableros Eléctricos',
          descripcion: 'Instalación y configuración de tableros eléctricos principales y secundarios',
          responsable_id: users[Math.floor(Math.random() * users.length)].id,
          prioridad: 'Alta',
          estado: 'En progreso',
          inicio_plan: new Date(baseDate.getTime() - 2*24*60*60*1000),
          fin_plan: new Date(baseDate.getTime() + 5*24*60*60*1000),
          checklist_id: checklists.find(c => c.categoria === 'Eléctrico')?.id || null,
          porcentaje_avance: 60
        },
        {
          proyecto_id: projectId,
          codigo: 'ACT-003',
          titulo: 'Tendido de Cableado',
          descripcion: 'Instalación de canaletas y tendido de cables según especificaciones',
          responsable_id: users[Math.floor(Math.random() * users.length)].id,
          prioridad: 'Media',
          estado: 'Pendiente',
          inicio_plan: new Date(baseDate.getTime() + 3*24*60*60*1000),
          fin_plan: new Date(baseDate.getTime() + 10*24*60*60*1000),
          checklist_id: checklists.find(c => c.categoria === 'Eléctrico')?.id || null,
          porcentaje_avance: 0
        }
      );
      break;
      
    case 'CCTV':
      activities.push(
        {
          proyecto_id: projectId,
          codigo: 'ACT-001',
          titulo: 'Diseño de Layout de Cámaras',
          descripcion: 'Diseño y ubicación estratégica de cámaras de videovigilancia',
          responsable_id: users[Math.floor(Math.random() * users.length)].id,
          prioridad: 'Alta',
          estado: 'En revisión',
          inicio_plan: new Date(baseDate.getTime() - 3*24*60*60*1000),
          fin_plan: new Date(baseDate.getTime() + 2*24*60*60*1000),
          checklist_id: checklists.find(c => c.categoria === 'CCTV')?.id || null,
          porcentaje_avance: 80
        },
        {
          proyecto_id: projectId,
          codigo: 'ACT-002',
          titulo: 'Instalación de Cámaras IP',
          descripcion: 'Instalación física y configuración de cámaras de videovigilancia IP',
          responsable_id: users[Math.floor(Math.random() * users.length)].id,
          prioridad: 'Alta',
          estado: 'Pendiente',
          inicio_plan: new Date(baseDate.getTime() + 2*24*60*60*1000),
          fin_plan: new Date(baseDate.getTime() + 8*24*60*60*1000),
          checklist_id: checklists.find(c => c.categoria === 'CCTV')?.id || null,
          porcentaje_avance: 0
        }
      );
      break;
      
    case 'Mantenimiento':
      activities.push(
        {
          proyecto_id: projectId,
          codigo: 'ACT-001',
          titulo: 'Inspección General de Equipos',
          descripcion: 'Inspección completa del estado de equipos y sistemas',
          responsable_id: users[Math.floor(Math.random() * users.length)].id,
          prioridad: 'Alta',
          estado: 'Completada',
          inicio_plan: new Date(baseDate.getTime() - 7*24*60*60*1000),
          fin_plan: new Date(baseDate.getTime() - 5*24*60*60*1000),
          checklist_id: checklists.find(c => c.categoria === 'Mantenimiento')?.id || null,
          porcentaje_avance: 100
        },
        {
          proyecto_id: projectId,
          codigo: 'ACT-002',
          titulo: 'Mantenimiento Preventivo Motores',
          descripcion: 'Mantenimiento preventivo de motores eléctricos y sistemas de transmisión',
          responsable_id: users[Math.floor(Math.random() * users.length)].id,
          prioridad: 'Media',
          estado: 'En progreso',
          inicio_plan: new Date(baseDate.getTime() - 3*24*60*60*1000),
          fin_plan: new Date(baseDate.getTime() + 4*24*60*60*1000),
          checklist_id: checklists.find(c => c.categoria === 'Mantenimiento')?.id || null,
          porcentaje_avance: 45
        }
      );
      break;
      
    default:
      activities.push(
        {
          proyecto_id: projectId,
          codigo: 'ACT-001',
          titulo: 'Actividad General del Proyecto',
          descripcion: 'Actividad general para el desarrollo del proyecto',
          responsable_id: users[Math.floor(Math.random() * users.length)].id,
          prioridad: 'Media',
          estado: 'Pendiente',
          inicio_plan: baseDate,
          fin_plan: new Date(baseDate.getTime() + 7*24*60*60*1000),
          checklist_id: checklists.find(c => c.categoria === 'General')?.id || null,
          porcentaje_avance: 0
        }
      );
  }
  
  return activities;
}

/**
 * Create sample assignments linking collaborators to activities
 * Requirements: 2.5
 */
function createSampleAssignments(collaborators, activities, projects) {
  console.log('Creating sample assignments...');
  
  const sheet = getSheet('Asignaciones');
  
  const sampleAssignments = [];
  
  // Create assignments for active activities
  const activeActivities = activities.filter(act => act.estado === 'En progreso' || act.estado === 'Pendiente');
  
  activeActivities.forEach(activity => {
    // Assign 1-3 collaborators per activity
    const numAssignments = Math.floor(Math.random() * 3) + 1;
    const selectedCollaborators = collaborators.sort(() => 0.5 - Math.random()).slice(0, numAssignments);
    
    selectedCollaborators.forEach((collaborator, index) => {
      const assignment = {
        colaborador_id: collaborator.id,
        actividad_id: activity.id,
        proyecto_id: activity.proyecto_id,
        fecha_inicio: new Date(),
        fecha_fin: new Date(Date.now() + 14*24*60*60*1000), // 14 days
        horas_planificadas: Math.floor(Math.random() * 40) + 20, // 20-60 hours
        rol_asignacion: index === 0 ? 'Responsable' : ['Colaborador', 'Apoyo'][Math.floor(Math.random() * 2)],
        estado: activity.estado === 'En progreso' ? 'En progreso' : 'Asignado'
      };
      
      sampleAssignments.push(assignment);
    });
  });
  
  const assignmentData = sampleAssignments.map(assignment => [
    generateId('ASG'),
    assignment.colaborador_id,
    assignment.actividad_id,
    assignment.proyecto_id,
    assignment.fecha_inicio,
    assignment.fecha_fin,
    assignment.horas_planificadas,
    assignment.rol_asignacion,
    assignment.estado,
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, assignmentData.length, 11).setValues(assignmentData);
  console.log(`Created ${assignmentData.length} sample assignments`);
  
  return assignmentData.map((row, index) => ({
    id: row[0],
    colaborador_id: row[1],
    actividad_id: row[2],
    proyecto_id: row[3]
  }));
}

/**
 * Create sample time entries for active assignments
 * Requirements: 2.5
 */
function createSampleTimeEntries(collaborators, activities, projects) {
  console.log('Creating sample time entries...');
  
  const sheet = getSheet('Horas');
  
  const sampleTimeEntries = [];
  
  // Create time entries for the last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30*24*60*60*1000);
  
  // Get some active activities
  const activeActivities = activities.filter(act => act.estado === 'En progreso' || act.estado === 'Completada').slice(0, 10);
  
  activeActivities.forEach(activity => {
    // Create 5-15 time entries per activity
    const numEntries = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < numEntries; i++) {
      const randomDate = new Date(thirtyDaysAgo.getTime() + Math.random() * (today.getTime() - thirtyDaysAgo.getTime()));
      const collaborator = collaborators[Math.floor(Math.random() * collaborators.length)];
      
      const timeEntry = {
        colaborador_id: collaborator.id,
        actividad_id: activity.id,
        proyecto_id: activity.proyecto_id,
        fecha: randomDate,
        horas_trabajadas: Math.floor(Math.random() * 8) + 1, // 1-8 hours
        descripcion_trabajo: getRandomWorkDescription(activity.titulo),
        tipo_trabajo: getRandomWorkType(),
        aprobado: Math.random() > 0.3 ? 'TRUE' : 'FALSE' // 70% approved
      };
      
      sampleTimeEntries.push(timeEntry);
    }
  });
  
  const timeEntryData = sampleTimeEntries.map(entry => [
    generateId('HOR'),
    entry.colaborador_id,
    entry.actividad_id,
    entry.proyecto_id,
    entry.fecha,
    entry.horas_trabajadas,
    entry.descripcion_trabajo,
    entry.tipo_trabajo,
    entry.aprobado,
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, timeEntryData.length, 11).setValues(timeEntryData);
  console.log(`Created ${timeEntryData.length} sample time entries`);
  
  return timeEntryData.map((row, index) => ({
    id: row[0],
    colaborador_id: row[1],
    actividad_id: row[2],
    horas_trabajadas: row[5]
  }));
}

/**
 * Generate random work descriptions
 * Requirements: 2.5
 */
function getRandomWorkDescription(activityTitle) {
  const descriptions = [
    `Trabajo en ${activityTitle.toLowerCase()} - instalación de componentes`,
    `Avance en ${activityTitle.toLowerCase()} - configuración y pruebas`,
    `Desarrollo de ${activityTitle.toLowerCase()} - montaje y conexiones`,
    `Continuación de ${activityTitle.toLowerCase()} - verificación de funcionamiento`,
    `Finalización de ${activityTitle.toLowerCase()} - documentación y entrega`,
    `Revisión de ${activityTitle.toLowerCase()} - corrección de observaciones`,
    `Supervisión de ${activityTitle.toLowerCase()} - control de calidad`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

/**
 * Generate random work types
 * Requirements: 2.5
 */
function getRandomWorkType() {
  const types = ['Normal', 'Normal', 'Normal', 'Normal', 'Sobretiempo', 'Nocturno', 'Feriado'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Create sample BOM entries for activities
 * Requirements: 2.5
 */
function createSampleBOMEntries(activities, projects, materials) {
  console.log('Creating sample BOM entries...');
  
  const sheet = getSheet('BOM');
  
  const sampleBOMEntries = [];
  
  // Create BOM entries for activities that need materials
  const materialActivities = activities.filter(act => 
    act.titulo.includes('Instalación') || 
    act.titulo.includes('Tendido') || 
    act.titulo.includes('Mantenimiento')
  );
  
  materialActivities.forEach(activity => {
    // Each activity needs 2-5 different materials
    const numMaterials = Math.floor(Math.random() * 4) + 2;
    const selectedMaterials = materials.sort(() => 0.5 - Math.random()).slice(0, numMaterials);
    
    selectedMaterials.forEach(material => {
      const qtyRequired = Math.floor(Math.random() * 50) + 10; // 10-60 units
      const qtyAssigned = Math.floor(qtyRequired * (Math.random() * 0.8 + 0.2)); // 20-100% of required
      
      const bomEntry = {
        actividad_id: activity.id,
        proyecto_id: activity.proyecto_id,
        material_id: material.id,
        qty_requerida: qtyRequired,
        qty_asignada: qtyAssigned,
        proveedor_sugerido: `Proveedor ${material.categoria}`,
        costo_unit_est: Math.floor(Math.random() * 100) + 10, // 10-110
        lead_time_dias: Math.floor(Math.random() * 14) + 1, // 1-14 days
        estado_abastecimiento: getRandomSupplyStatus(qtyRequired, qtyAssigned),
        fecha_requerida: new Date(Date.now() + Math.random() * 30*24*60*60*1000) // Next 30 days
      };
      
      sampleBOMEntries.push(bomEntry);
    });
  });
  
  const bomData = sampleBOMEntries.map(entry => [
    generateId('BOM'),
    entry.actividad_id,
    entry.proyecto_id,
    entry.material_id,
    entry.qty_requerida,
    entry.qty_asignada,
    entry.proveedor_sugerido,
    entry.costo_unit_est,
    entry.lead_time_dias,
    entry.estado_abastecimiento,
    entry.fecha_requerida,
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, bomData.length, 13).setValues(bomData);
  console.log(`Created ${bomData.length} sample BOM entries`);
  
  return bomData.map((row, index) => ({
    id: row[0],
    actividad_id: row[1],
    material_id: row[3],
    qty_requerida: row[4],
    qty_asignada: row[5]
  }));
}

/**
 * Generate supply status based on quantities
 * Requirements: 2.5
 */
function getRandomSupplyStatus(required, assigned) {
  if (assigned === 0) return 'Por pedir';
  if (assigned < required * 0.5) return 'Pedido';
  if (assigned < required) return 'En tránsito';
  if (assigned === required) return 'Entregado';
  return 'Recibido';
}

/**
 * Create sample evidence files for activities
 * Requirements: 2.5
 */
function createSampleEvidences(activities, projects, users) {
  console.log('Creating sample evidences...');
  
  const sheet = getSheet('Evidencias');
  
  const sampleEvidences = [];
  
  // Create evidence for completed and in-progress activities
  const activitiesWithEvidence = activities.filter(act => 
    act.estado === 'Completada' || act.estado === 'En progreso'
  );
  
  activitiesWithEvidence.forEach(activity => {
    // Each activity has 1-4 evidence files
    const numEvidences = Math.floor(Math.random() * 4) + 1;
    
    for (let i = 0; i < numEvidences; i++) {
      const evidenceType = ['Foto', 'Documento', 'Video'][Math.floor(Math.random() * 3)];
      const user = users[Math.floor(Math.random() * users.length)];
      
      const evidence = {
        actividad_id: activity.id,
        proyecto_id: activity.proyecto_id,
        tipo: evidenceType,
        nombre_archivo: `${evidenceType.toLowerCase()}_${activity.codigo}_${i + 1}.${getFileExtension(evidenceType)}`,
        url_archivo: `https://drive.google.com/file/d/sample_${generateId('FILE')}/view`,
        descripcion: `${evidenceType} de evidencia para ${activity.titulo}`,
        subido_por: user.id
      };
      
      sampleEvidences.push(evidence);
    }
  });
  
  const evidenceData = sampleEvidences.map(evidence => [
    generateId('EVI'),
    evidence.actividad_id,
    evidence.proyecto_id,
    evidence.tipo,
    evidence.nombre_archivo,
    evidence.url_archivo,
    evidence.descripcion,
    evidence.subido_por,
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, evidenceData.length, 10).setValues(evidenceData);
  console.log(`Created ${evidenceData.length} sample evidences`);
  
  return evidenceData.map((row, index) => ({
    id: row[0],
    actividad_id: row[1],
    tipo: row[3],
    nombre_archivo: row[4]
  }));
}

/**
 * Get file extension based on evidence type
 * Requirements: 2.5
 */
function getFileExtension(type) {
  switch (type) {
    case 'Foto': return 'jpg';
    case 'Documento': return 'pdf';
    case 'Video': return 'mp4';
    case 'Audio': return 'mp3';
    default: return 'pdf';
  }
}

/**
 * Create sample project documents
 * Requirements: 2.5
 */
function createSampleDocuments(projects, users) {
  console.log('Creating sample documents...');
  
  const sheet = getSheet('Documentos');
  
  const sampleDocuments = [];
  
  projects.forEach(project => {
    // Each project has 2-5 documents
    const numDocuments = Math.floor(Math.random() * 4) + 2;
    const documentTypes = ['Plano', 'Especificación', 'Manual', 'Certificado', 'Informe', 'Contrato'];
    
    for (let i = 0; i < numDocuments; i++) {
      const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      
      const document = {
        proyecto_id: project.id,
        nombre: `${docType} - ${project.nombre.substring(0, 30)}`,
        tipo_documento: docType,
        url_archivo: `https://drive.google.com/file/d/doc_${generateId('DOC')}/view`,
        version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
        estado: getRandomDocumentStatus(),
        creado_por: user.id
      };
      
      sampleDocuments.push(document);
    }
  });
  
  const documentData = sampleDocuments.map(doc => [
    generateId('DOC'),
    doc.proyecto_id,
    doc.nombre,
    doc.tipo_documento,
    doc.url_archivo,
    doc.version,
    doc.estado,
    doc.creado_por,
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, documentData.length, 10).setValues(documentData);
  console.log(`Created ${documentData.length} sample documents`);
  
  return documentData.map((row, index) => ({
    id: row[0],
    proyecto_id: row[1],
    nombre: row[2],
    tipo_documento: row[3]
  }));
}

/**
 * Generate random document status
 * Requirements: 2.5
 */
function getRandomDocumentStatus() {
  const statuses = ['Aprobado', 'Aprobado', 'En revisión', 'Borrador', 'Obsoleto'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

/**
 * Setup comprehensive system configuration
 * Requirements: 2.5
 */
function setupSystemConfiguration() {
  console.log('Setting up system configuration...');
  
  const configSheet = getSheet('Config');
  
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
    ['audit_log_retention_days', '90', 'Días de retención de logs de auditoría', new Date()],
    ['email_notifications', 'TRUE', 'Habilitar notificaciones por email', new Date()],
    ['sms_notifications', 'FALSE', 'Habilitar notificaciones por SMS', new Date()],
    ['auto_backup', 'TRUE', 'Habilitar respaldo automático', new Date()],
    ['debug_mode', 'FALSE', 'Modo de depuración del sistema', new Date()],
    ['api_rate_limit', '1000', 'Límite de requests por hora por usuario', new Date()]
  ];
  
  configSheet.getRange(2, 1, configData.length, 4).setValues(configData);
  console.log(`Created ${configData.length} system configuration entries`);
}

/**
 * Create sample activity checklists (instances of checklists for specific activities)
 * Requirements: 2.5
 */
function createSampleActivityChecklists(activities, checklists) {
  console.log('Creating sample activity checklists...');
  
  const sheet = getSheet('ActivityChecklists');
  
  const sampleActivityChecklists = [];
  
  // Create checklist instances for activities that have checklists assigned
  const activitiesWithChecklists = activities.filter(act => act.checklist_id);
  
  activitiesWithChecklists.forEach(activity => {
    const checklist = checklists.find(c => c.id === activity.checklist_id);
    if (!checklist) return;
    
    // Create a status object for each checklist item
    const itemsStatus = {};
    const numItems = 8; // Assume 8 items per checklist for demo
    
    for (let i = 0; i < numItems; i++) {
      const itemId = `item_${i + 1}`;
      // Completed activities have all items checked, in-progress have some checked
      const isCompleted = activity.estado === 'Completada' ? true : Math.random() > 0.6;
      itemsStatus[itemId] = {
        completed: isCompleted,
        completed_date: isCompleted ? new Date() : null,
        notes: isCompleted ? 'Completado según especificaciones' : ''
      };
    }
    
    const allCompleted = Object.values(itemsStatus).every(item => item.completed);
    
    const activityChecklist = {
      actividad_id: activity.id,
      checklist_id: checklist.id,
      items_status_json: JSON.stringify(itemsStatus),
      completado: allCompleted ? 'TRUE' : 'FALSE',
      fecha_completado: allCompleted ? new Date() : null
    };
    
    sampleActivityChecklists.push(activityChecklist);
  });
  
  const activityChecklistData = sampleActivityChecklists.map(acl => [
    generateId('ACL'),
    acl.actividad_id,
    acl.checklist_id,
    acl.items_status_json,
    acl.completado,
    acl.fecha_completado,
    new Date(),
    new Date()
  ]);
  
  if (activityChecklistData.length > 0) {
    sheet.getRange(2, 1, activityChecklistData.length, 8).setValues(activityChecklistData);
  }
  
  console.log(`Created ${activityChecklistData.length} sample activity checklists`);
  
  return activityChecklistData.map((row, index) => ({
    id: row[0],
    actividad_id: row[1],
    checklist_id: row[2],
    completado: row[4]
  }));
}

/**
 * Generate unique ID with prefix
 * Requirements: 2.5
 */
function generateId(prefix = 'GEN') {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}_${timestamp.toString(36).toUpperCase()}${random}`;
}

/**
 * Get sheet by name with error handling
 * Requirements: 2.5
 */
function getSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found. Please run setupDatabase() first.`);
  }
  
  return sheet;
}

/**
 * Get demo user credentials for testing
 * Requirements: 2.5
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
      nombre: 'Carlos Mendoza'
    },
    editor: {
      email: 'gerente.proyectos@servesplatform.com',
      password: 'editor123',
      nombre: 'María González Ruiz'
    },
    tecnico: {
      email: 'tecnico.senior@servesplatform.com',
      password: 'tecnico123',
      nombre: 'Juan Pérez Morales'
    }
  };
}

/**
 * Generate summary report of created sample data
 * Requirements: 2.5
 */
function generateSampleDataReport() {
  try {
    const report = {
      generated_at: new Date().toISOString(),
      sheets_summary: {},
      data_relationships: {
        users_to_projects: 'Users assigned as project managers',
        projects_to_activities: 'Activities created for each project based on service line',
        activities_to_assignments: 'Collaborators assigned to activities',
        assignments_to_time_entries: 'Time entries created for active assignments',
        activities_to_bom: 'Materials assigned to activities requiring them',
        activities_to_evidence: 'Evidence files for completed/in-progress activities',
        projects_to_documents: 'Project documentation and deliverables'
      },
      validation_scenarios: {
        stock_alerts: 'Materials with stock_actual <= stock_minimo',
        quantity_alerts: 'BOM entries with qty_asignada < qty_requerida',
        pending_approvals: 'Time entries with aprobado = FALSE',
        overdue_activities: 'Activities past their planned end date',
        certification_expiry: 'Collaborator certifications expiring soon'
      }
    };
    
    // Count records in each sheet
    const sheetNames = [
      'Usuarios', 'Clientes', 'Proyectos', 'Actividades', 'Colaboradores',
      'Asignaciones', 'Horas', 'Materiales', 'BOM', 'Checklists',
      'ActivityChecklists', 'Evidencias', 'Documentos', 'Config'
    ];
    
    sheetNames.forEach(sheetName => {
      try {
        const sheet = getSheet(sheetName);
        const lastRow = sheet.getLastRow();
        report.sheets_summary[sheetName] = Math.max(0, lastRow - 1); // Subtract header row
      } catch (error) {
        report.sheets_summary[sheetName] = 0;
      }
    });
    
    console.log('Sample data report generated:', JSON.stringify(report, null, 2));
    return report;
    
  } catch (error) {
    console.error('Error generating sample data report:', error);
    return { error: error.message };
  }
}