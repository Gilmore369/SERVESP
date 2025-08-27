/**
 * Seed Operational Data Generator for ServesPlatform
 * Creates sample projects, personnel, materials, and operational data
 */

/**
 * Main function to populate operational data
 * Requirements: 3.1, 4.1, 5.1
 */
function populateOperationalData() {
  try {
    console.log('Starting operational data population...');
    
    // Create sample personnel with assignments
    createSamplePersonnel();
    
    // Create sample materials and BOM data
    createSampleMaterials();
    
    // Generate demo projects with activities
    createDemoProjects();
    
    // Create sample assignments
    createSampleAssignments();
    
    // Generate sample time entries
    createSampleTimeEntries();
    
    // Create sample BOM entries
    createSampleBOMEntries();
    
    console.log('Operational data population completed successfully!');
    
    return {
      success: true,
      message: 'Operational demo data created successfully',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error populating operational data:', error);
    throw error;
  }
}

/**
 * Create sample personnel with assignments
 * Requirements: 4.1
 */
function createSamplePersonnel() {
  console.log('Creating sample personnel...');
  
  const sheet = getSheet('Colaboradores');
  
  const samplePersonnel = [
    {
      dni_ruc: '12345678',
      nombres: 'Juan Carlos Pérez López',
      telefono: '987654321',
      email: 'juan.perez@servesplatform.com',
      especialidad: 'Electricista',
      tarifa_hora: 25.50,
      zona: 'Lima Centro',
      certificaciones: [
        { tipo: 'Certificación Eléctrica Nivel II', vencimiento: '2025-12-31' },
        { tipo: 'Seguridad Industrial', vencimiento: '2025-06-30' }
      ]
    },
    {
      dni_ruc: '87654321',
      nombres: 'Ana María López García',
      telefono: '987654322',
      email: 'ana.lopez@servesplatform.com',
      especialidad: 'Técnico Civil',
      tarifa_hora: 22.00,
      zona: 'Lima Norte',
      certificaciones: [
        { tipo: 'Técnico en Construcción', vencimiento: '2025-08-15' },
        { tipo: 'Manejo de Equipos Pesados', vencimiento: '2025-10-20' }
      ]
    },
    {
      dni_ruc: '11223344',
      nombres: 'Carlos Eduardo Rodríguez Vega',
      telefono: '987654323',
      email: 'carlos.rodriguez@servesplatform.com',
      especialidad: 'Técnico CCTV',
      tarifa_hora: 28.00,
      zona: 'Lima Sur',
      certificaciones: [
        { tipo: 'Certificación en Videovigilancia', vencimiento: '2025-11-30' },
        { tipo: 'Redes y Telecomunicaciones', vencimiento: '2025-09-15' }
      ]
    },
    {
      dni_ruc: '55667788',
      nombres: 'María Elena Vásquez Torres',
      telefono: '987654324',
      email: 'maria.vasquez@servesplatform.com',
      especialidad: 'Supervisor',
      tarifa_hora: 35.00,
      zona: 'Lima Centro',
      certificaciones: [
        { tipo: 'Supervisión de Obras', vencimiento: '2025-07-20' },
        { tipo: 'Gestión de Proyectos', vencimiento: '2025-12-10' }
      ]
    },
    {
      dni_ruc: '99887766',
      nombres: 'Roberto Silva Mendoza',
      telefono: '987654325',
      email: 'roberto.silva@servesplatform.com',
      especialidad: 'Mantenimiento',
      tarifa_hora: 20.00,
      zona: 'Callao',
      certificaciones: [
        { tipo: 'Mantenimiento Industrial', vencimiento: '2025-05-25' }
      ]
    },
    {
      dni_ruc: '44332211',
      nombres: 'Patricia Mendoza Flores',
      telefono: '987654326',
      email: 'patricia.mendoza@servesplatform.com',
      especialidad: 'Ingeniero',
      tarifa_hora: 45.00,
      zona: 'Lima Este',
      certificaciones: [
        { tipo: 'Ingeniería Eléctrica', vencimiento: '2026-03-15' },
        { tipo: 'Project Management Professional', vencimiento: '2025-12-31' }
      ]
    }
  ];
  
  const personnelData = samplePersonnel.map(person => [
    generateId('Colaboradores'),
    person.dni_ruc,
    person.nombres,
    person.telefono,
    person.email,
    person.especialidad,
    person.tarifa_hora,
    person.zona,
    JSON.stringify(person.certificaciones),
    'TRUE',
    new Date(),
    new Date()
  ]);
  
  sheet.getRange(2, 1, personnelData.length, 12).setValues(personnelData);
  console.log(`Created ${personnelData.length} sample personnel records`);
}

/**
 * Create sample materials and BOM data
 * Requirements: 5.1
 */
function createSampleMaterials() {
  console.log('Creating sample materials...');
  
  const sheet = getSheet('Materiales');
  
  const sampleMaterials = [
    {
      sku: 'CBL-THW-12',
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
      sku: 'CBL-THW-14',
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
      sku: 'CNT-MC4-M',
      descripcion: 'Conector MC4 Macho',
      categoria: 'Conectores',
      unidad: 'Unidad',
      costo_ref: 15.00,
      stock_actual: 50,
      stock_minimo: 20,
      proveedor_principal: 'Conectores Industriales SAC',
      ubicacion_almacen: 'Almacén B-2'
    },
    {
      sku: 'CNT-MC4-H',
      descripcion: 'Conector MC4 Hembra',
      categoria: 'Conectores',
      unidad: 'Unidad',
      costo_ref: 15.00,
      stock_actual: 45,
      stock_minimo: 20,
      proveedor_principal: 'Conectores Industriales SAC',
      ubicacion_almacen: 'Almacén B-2'
    },
    {
      sku: 'TBL-MONO-4P',
      descripcion: 'Tablero Monofásico 4 Polos',
      categoria: 'Equipos',
      unidad: 'Unidad',
      costo_ref: 120.00,
      stock_actual: 15,
      stock_minimo: 5,
      proveedor_principal: 'Tableros Eléctricos Lima',
      ubicacion_almacen: 'Almacén C-3'
    },
    {
      sku: 'BRK-20A-1P',
      descripcion: 'Breaker 20A Monopolar',
      categoria: 'Equipos',
      unidad: 'Unidad',
      costo_ref: 25.00,
      stock_actual: 30,
      stock_minimo: 10,
      proveedor_principal: 'Schneider Electric Perú',
      ubicacion_almacen: 'Almacén C-3'
    },
    {
      sku: 'CAM-IP-2MP',
      descripcion: 'Cámara IP 2MP Exterior',
      categoria: 'Equipos',
      unidad: 'Unidad',
      costo_ref: 180.00,
      stock_actual: 12,
      stock_minimo: 5,
      proveedor_principal: 'Hikvision Perú',
      ubicacion_almacen: 'Almacén D-4'
    },
    {
      sku: 'CBL-UTP-CAT6',
      descripcion: 'Cable UTP Cat6 305m',
      categoria: 'Cables',
      unidad: 'Rollo',
      costo_ref: 280.00,
      stock_actual: 8,
      stock_minimo: 3,
      proveedor_principal: 'Panduit Perú',
      ubicacion_almacen: 'Almacén A-1'
    },
    {
      sku: 'HER-MULT-DIG',
      descripcion: 'Multímetro Digital',
      categoria: 'Herramientas',
      unidad: 'Unidad',
      costo_ref: 85.00,
      stock_actual: 6,
      stock_minimo: 2,
      proveedor_principal: 'Fluke Perú',
      ubicacion_almacen: 'Almacén E-5'
    },
    {
      sku: 'SEG-CASCO-IND',
      descripcion: 'Casco de Seguridad Industrial',
      categoria: 'Seguridad',
      unidad: 'Unidad',
      costo_ref: 25.00,
      stock_actual: 20,
      stock_minimo: 8,
      proveedor_principal: 'EPP Seguridad Total',
      ubicacion_almacen: 'Almacén F-6'
    }
  ];
  
  const materialData = sampleMaterials.map(material => [
    generateId('Materiales'),
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
}

/**
 * Generate demo projects with activities
 * Requirements: 3.1
 */
function createDemoProjects() {
  console.log('Creating demo projects...');
  
  // Get existing data for references
  const clientsSheet = getSheet('Clientes');
  const clients = getSheetData(clientsSheet);
  
  const usersSheet = getSheet('Usuarios');
  const users = getSheetData(usersSheet).filter(u => u.rol === 'editor');
  
  if (clients.length === 0 || users.length === 0) {
    console.warn('No clients or editor users found. Skipping project creation.');
    return;
  }
  
  const projectsSheet = getSheet('Proyectos');
  
  const demoProjects = [
    {
      codigo: 'PRY-001',
      nombre: 'Instalación Sistema Eléctrico - Edificio Corporativo',
      cliente_id: clients[0].id,
      responsable_id: users[0].id,
      ubicacion: 'San Isidro, Lima',
      descripcion: 'Instalación completa del sistema eléctrico para edificio corporativo de 8 pisos',
      linea_servicio: 'Eléctrico',
      sla_objetivo: 45,
      inicio_plan: new Date(),
      fin_plan: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      presupuesto_total: 85000,
      moneda: 'PEN',
      estado: 'En progreso',
      avance_pct: 35
    },
    {
      codigo: 'PRY-002',
      nombre: 'Sistema CCTV - Centro Comercial',
      cliente_id: clients[1] ? clients[1].id : clients[0].id,
      responsable_id: users[1] ? users[1].id : users[0].id,
      ubicacion: 'Independencia, Lima',
      descripcion: 'Instalación de sistema de videovigilancia con 24 cámaras IP',
      linea_servicio: 'CCTV',
      sla_objetivo: 30,
      inicio_plan: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      fin_plan: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      presupuesto_total: 45000,
      moneda: 'PEN',
      estado: 'En progreso',
      avance_pct: 60
    },
    {
      codigo: 'PRY-003',
      nombre: 'Mantenimiento Preventivo - Hospital',
      cliente_id: clients[2] ? clients[2].id : clients[0].id,
      responsable_id: users[0].id,
      ubicacion: 'Cercado de Lima',
      descripcion: 'Mantenimiento preventivo de sistemas eléctricos y equipos médicos',
      linea_servicio: 'Mantenimiento',
      sla_objetivo: 15,
      inicio_plan: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      fin_plan: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      presupuesto_total: 25000,
      moneda: 'PEN',
      estado: 'Planificación',
      avance_pct: 0
    }
  ];
  
  const projectData = demoProjects.map(project => [
    generateId('Proyectos'),
    project.codigo,
    project.nombre,
    project.cliente_id,
    project.responsable_id,
    project.ubicacion,
    project.descripcion,
    project.linea_servicio,
    project.sla_objetivo,
    project.inicio_plan,
    project.fin_plan,
    project.presupuesto_total,
    project.moneda,
    project.estado,
    project.avance_pct,
    new Date(),
    new Date()
  ]);
  
  projectsSheet.getRange(2, 1, projectData.length, 17).setValues(projectData);
  console.log(`Created ${projectData.length} demo projects`);
  
  // Create activities for each project
  createActivitiesForProjects(projectData);
}

/**
 * Create activities for demo projects
 */
function createActivitiesForProjects(projectData) {
  console.log('Creating activities for demo projects...');
  
  const activitiesSheet = getSheet('Actividades');
  const checklistsSheet = getSheet('Checklists');
  const checklists = getSheetData(checklistsSheet);
  
  const usersSheet = getSheet('Usuarios');
  const users = getSheetData(usersSheet);
  
  const allActivities = [];
  
  projectData.forEach((project, index) => {
    const projectId = project[0]; // ID is first column
    const projectStartDate = project[9]; // inicio_plan
    
    let activities = [];
    
    if (index === 0) { // Electrical project
      activities = [
        {
          codigo: 'ACT-001',
          titulo: 'Análisis de Planos y Requerimientos',
          descripcion: 'Revisión detallada de planos eléctricos y especificaciones técnicas',
          prioridad: 'Alta',
          estado: 'Completada',
          inicio_plan: new Date(projectStartDate.getTime()),
          fin_plan: new Date(projectStartDate.getTime() + 3 * 24 * 60 * 60 * 1000),
          porcentaje_avance: 100
        },
        {
          codigo: 'ACT-002',
          titulo: 'Instalación de Tableros Principales',
          descripcion: 'Montaje e instalación de tableros eléctricos principales',
          prioridad: 'Alta',
          estado: 'En progreso',
          inicio_plan: new Date(projectStartDate.getTime() + 4 * 24 * 60 * 60 * 1000),
          fin_plan: new Date(projectStartDate.getTime() + 10 * 24 * 60 * 60 * 1000),
          porcentaje_avance: 70
        },
        {
          codigo: 'ACT-003',
          titulo: 'Cableado de Circuitos de Iluminación',
          descripcion: 'Tendido de cables para circuitos de iluminación en todos los pisos',
          prioridad: 'Media',
          estado: 'Pendiente',
          inicio_plan: new Date(projectStartDate.getTime() + 11 * 24 * 60 * 60 * 1000),
          fin_plan: new Date(projectStartDate.getTime() + 20 * 24 * 60 * 60 * 1000),
          porcentaje_avance: 0
        }
      ];
    } else if (index === 1) { // CCTV project
      activities = [
        {
          codigo: 'ACT-004',
          titulo: 'Instalación de Cámaras Exteriores',
          descripcion: 'Montaje de cámaras IP en perímetro del centro comercial',
          prioridad: 'Alta',
          estado: 'Completada',
          inicio_plan: new Date(projectStartDate.getTime()),
          fin_plan: new Date(projectStartDate.getTime() + 5 * 24 * 60 * 60 * 1000),
          porcentaje_avance: 100
        },
        {
          codigo: 'ACT-005',
          titulo: 'Configuración de Sistema de Grabación',
          descripcion: 'Setup y configuración del NVR y sistema de almacenamiento',
          prioridad: 'Alta',
          estado: 'En progreso',
          inicio_plan: new Date(projectStartDate.getTime() + 6 * 24 * 60 * 60 * 1000),
          fin_plan: new Date(projectStartDate.getTime() + 12 * 24 * 60 * 60 * 1000),
          porcentaje_avance: 80
        }
      ];
    } else { // Maintenance project
      activities = [
        {
          codigo: 'ACT-006',
          titulo: 'Inspección de Equipos Críticos',
          descripcion: 'Revisión y diagnóstico de equipos médicos y sistemas eléctricos',
          prioridad: 'Crítica',
          estado: 'Pendiente',
          inicio_plan: new Date(projectStartDate.getTime()),
          fin_plan: new Date(projectStartDate.getTime() + 3 * 24 * 60 * 60 * 1000),
          porcentaje_avance: 0
        }
      ];
    }
    
    activities.forEach(activity => {
      const responsableId = users.find(u => u.rol === 'editor')?.id || users[0].id;
      const checklistId = checklists.find(c => c.categoria === project[7])?.id || null; // linea_servicio
      
      allActivities.push([
        generateId('Actividades'),
        projectId,
        activity.codigo,
        activity.titulo,
        activity.descripcion,
        responsableId,
        activity.prioridad,
        activity.estado,
        activity.inicio_plan,
        activity.fin_plan,
        checklistId,
        activity.porcentaje_avance,
        '', // evidencias_urls
        new Date(),
        new Date()
      ]);
    });
  });
  
  if (allActivities.length > 0) {
    activitiesSheet.getRange(2, 1, allActivities.length, 15).setValues(allActivities);
    console.log(`Created ${allActivities.length} activities for demo projects`);
  }
}

/**
 * Create sample assignments
 */
function createSampleAssignments() {
  console.log('Creating sample assignments...');
  
  const assignmentsSheet = getSheet('Asignaciones');
  const collaboratorsSheet = getSheet('Colaboradores');
  const activitiesSheet = getSheet('Actividades');
  const projectsSheet = getSheet('Proyectos');
  
  const collaborators = getSheetData(collaboratorsSheet);
  const activities = getSheetData(activitiesSheet);
  const projects = getSheetData(projectsSheet);
  
  if (collaborators.length === 0 || activities.length === 0) {
    console.warn('No collaborators or activities found. Skipping assignments creation.');
    return;
  }
  
  const sampleAssignments = [];
  
  // Assign collaborators to activities
  activities.forEach((activity, index) => {
    const collaborator = collaborators[index % collaborators.length];
    const project = projects.find(p => p.id === activity.proyecto_id);
    
    if (collaborator && project) {
      sampleAssignments.push([
        generateId('Asignaciones'),
        collaborator.id,
        activity.id,
        activity.proyecto_id,
        activity.inicio_plan,
        activity.fin_plan,
        40, // horas_planificadas
        index === 0 ? 'Responsable' : 'Colaborador',
        activity.estado === 'Completada' ? 'Completado' : 
        activity.estado === 'En progreso' ? 'En progreso' : 'Asignado',
        new Date(),
        new Date()
      ]);
    }
  });
  
  if (sampleAssignments.length > 0) {
    assignmentsSheet.getRange(2, 1, sampleAssignments.length, 11).setValues(sampleAssignments);
    console.log(`Created ${sampleAssignments.length} sample assignments`);
  }
}

/**
 * Generate sample time entries
 */
function createSampleTimeEntries() {
  console.log('Creating sample time entries...');
  
  const hoursSheet = getSheet('Horas');
  const assignmentsSheet = getSheet('Asignaciones');
  const assignments = getSheetData(assignmentsSheet);
  
  if (assignments.length === 0) {
    console.warn('No assignments found. Skipping time entries creation.');
    return;
  }
  
  const sampleTimeEntries = [];
  
  assignments.forEach(assignment => {
    // Create multiple time entries for each assignment
    const startDate = new Date(assignment.fecha_inicio);
    const endDate = new Date();
    
    // Generate time entries for the past week
    for (let i = 0; i < 7; i++) {
      const workDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      
      if (workDate <= endDate && workDate.getDay() !== 0 && workDate.getDay() !== 6) { // Skip weekends
        sampleTimeEntries.push([
          generateId('Horas'),
          assignment.colaborador_id,
          assignment.actividad_id,
          assignment.proyecto_id,
          workDate,
          8, // horas_trabajadas
          `Trabajo realizado en ${assignment.rol_asignacion.toLowerCase()} - Día ${i + 1}`,
          'Normal',
          assignment.estado === 'Completado' ? 'TRUE' : 'FALSE',
          new Date(),
          new Date()
        ]);
      }
    }
  });
  
  if (sampleTimeEntries.length > 0) {
    hoursSheet.getRange(2, 1, sampleTimeEntries.length, 11).setValues(sampleTimeEntries);
    console.log(`Created ${sampleTimeEntries.length} sample time entries`);
  }
}

/**
 * Create sample BOM entries
 */
function createSampleBOMEntries() {
  console.log('Creating sample BOM entries...');
  
  const bomSheet = getSheet('BOM');
  const activitiesSheet = getSheet('Actividades');
  const materialsSheet = getSheet('Materiales');
  
  const activities = getSheetData(activitiesSheet);
  const materials = getSheetData(materialsSheet);
  
  if (activities.length === 0 || materials.length === 0) {
    console.warn('No activities or materials found. Skipping BOM creation.');
    return;
  }
  
  const sampleBOMEntries = [];
  
  activities.forEach(activity => {
    // Assign 2-3 materials per activity
    const numMaterials = Math.min(3, materials.length);
    
    for (let i = 0; i < numMaterials; i++) {
      const material = materials[i];
      const qtyRequired = Math.floor(Math.random() * 50) + 10;
      const qtyAssigned = activity.estado === 'Completada' ? qtyRequired : 
                         activity.estado === 'En progreso' ? Math.floor(qtyRequired * 0.7) : 0;
      
      sampleBOMEntries.push([
        generateId('BOM'),
        activity.id,
        activity.proyecto_id,
        material.id,
        qtyRequired,
        qtyAssigned,
        material.proveedor_principal,
        material.costo_ref,
        Math.floor(Math.random() * 10) + 3, // lead_time_dias
        qtyAssigned >= qtyRequired ? 'Entregado' : 
        qtyAssigned > 0 ? 'Recibido' : 'Por pedir',
        activity.inicio_plan,
        new Date(),
        new Date()
      ]);
    }
  });
  
  if (sampleBOMEntries.length > 0) {
    bomSheet.getRange(2, 1, sampleBOMEntries.length, 13).setValues(sampleBOMEntries);
    console.log(`Created ${sampleBOMEntries.length} sample BOM entries`);
  }
}

/**
 * Generate unique ID with table prefix (duplicate from SeedData.gs for independence)
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
    'Checklists': 'CHK'
  };
  
  const prefix = prefixes[tableName] || 'GEN';
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}_${timestamp.toString(36).toUpperCase()}${random}`;
}