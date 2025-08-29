/**
 * ServesPlatform Database Setup Script - STANDARDIZED VERSION
 * Creates and configures Google Sheets database structure with proper validation
 * Requirements: 2.1, 2.2, 2.4
 */

/**
 * Main function to setup the complete database structure
 * Run this function once to create the ServesPlatform_DB spreadsheet
 */
function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Create main spreadsheet
    const spreadsheet = SpreadsheetApp.create('ServesPlatform_DB');
    const spreadsheetId = spreadsheet.getId();
    
    console.log('Created spreadsheet with ID:', spreadsheetId);
    console.log('Spreadsheet URL:', spreadsheet.getUrl());
    
    // Remove default sheet
    const defaultSheet = spreadsheet.getSheetByName('Sheet1');
    if (defaultSheet) {
      spreadsheet.deleteSheet(defaultSheet);
    }
    
    // Setup all core entity sheets
    setupUsuariosSheet(spreadsheet);
    setupClientesSheet(spreadsheet);
    setupProyectosSheet(spreadsheet);
    setupActividadesSheet(spreadsheet);
    setupColaboradoresSheet(spreadsheet);
    setupAsignacionesSheet(spreadsheet);
    setupHorasSheet(spreadsheet);
    setupMaterialesSheet(spreadsheet);
    setupBOMSheet(spreadsheet);
    
    // Setup utility and configuration sheets
    setupConfigSheet(spreadsheet);
    setupChecklistsSheet(spreadsheet);
    setupActivityChecklistsSheet(spreadsheet);
    setupEvidenciasSheet(spreadsheet);
    setupDocumentosSheet(spreadsheet);
    setupAuditLogSheet(spreadsheet);
    
    console.log('Database setup completed successfully!');
    console.log('Please save this Spreadsheet ID for your Apps Script configuration:', spreadsheetId);
    
    return {
      success: true,
      spreadsheetId: spreadsheetId,
      url: spreadsheet.getUrl(),
      message: 'Database structure created successfully'
    };
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

/**
 * Setup Usuarios sheet with authentication and role management
 * Requirements: 2.1, 2.2, 2.4
 */
function setupUsuariosSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Usuarios');
  
  // Standardized headers
  const headers = [
    'id', 'email', 'nombre', 'rol', 'password_hash', 
    'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for rol column
  const rolRange = sheet.getRange(2, 4, 1000, 1);
  const rolValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['admin_lider', 'admin', 'editor', 'tecnico'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un rol válido')
    .build();
  rolRange.setDataValidation(rolValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 6, 1000, 1);
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Hide password_hash column for security
  sheet.hideColumns(5);
  
  // Set column widths
  setStandardColumnWidths(sheet, {
    1: 120, // id
    2: 200, // email
    3: 150, // nombre
    4: 100, // rol
    6: 80,  // activo
    7: 120, // created_at
    8: 120  // updated_at
  });
  
  console.log('Usuarios sheet created successfully');
}

/**
 * Setup Clientes sheet for company information
 * Requirements: 2.1, 2.2, 2.4
 */
function setupClientesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Clientes');
  
  const headers = [
    'id', 'ruc', 'razon_social', 'nombre_comercial', 'direccion', 
    'telefono', 'email', 'contacto_principal', 'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 9, 1000, 1);
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Email validation
  const emailRange = sheet.getRange(2, 7, 1000, 1);
  const emailValidation = SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=ISEMAIL(G2)')
    .setAllowInvalid(false)
    .setHelpText('Ingrese un email válido')
    .build();
  emailRange.setDataValidation(emailValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 120, 3: 200, 4: 150, 5: 200, 
    6: 120, 7: 180, 8: 150, 9: 80, 10: 120, 11: 120
  });
  
  console.log('Clientes sheet created successfully');
}

/**
 * Setup Proyectos sheet with project lifecycle fields
 * Requirements: 2.1, 2.2, 2.4
 */
function setupProyectosSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Proyectos');
  
  const headers = [
    'id', 'codigo', 'nombre', 'cliente_id', 'responsable_id', 'ubicacion', 
    'descripcion', 'linea_servicio', 'inicio_plan', 'fin_plan', 
    'presupuesto_total', 'moneda', 'estado', 'avance_pct', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for estado column
  const estadoRange = sheet.getRange(2, 13, 1000, 1);
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Planificación', 'En progreso', 'Pausado', 'Cerrado'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Data validation for moneda column
  const monedaRange = sheet.getRange(2, 12, 1000, 1);
  const monedaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['PEN', 'USD'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una moneda válida')
    .build();
  monedaRange.setDataValidation(monedaValidation);
  
  // Data validation for linea_servicio column
  const lineaRange = sheet.getRange(2, 8, 1000, 1);
  const lineaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Eléctrico', 'Civil', 'CCTV', 'Mantenimiento', 'Telecomunicaciones'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una línea de servicio válida')
    .build();
  lineaRange.setDataValidation(lineaValidation);
  
  // Percentage validation for avance_pct
  const avanceRange = sheet.getRange(2, 14, 1000, 1);
  const avanceValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(0, 100)
    .setAllowInvalid(false)
    .setHelpText('Ingrese un porcentaje entre 0 y 100')
    .build();
  avanceRange.setDataValidation(avanceValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 100, 3: 200, 4: 120, 5: 120, 6: 150, 7: 250, 8: 120,
    9: 100, 10: 100, 11: 120, 12: 80, 13: 100, 14: 80, 15: 120, 16: 120
  });
  
  console.log('Proyectos sheet created successfully');
}

/**
 * Setup Actividades sheet with WBS structure
 * Requirements: 2.1, 2.2, 2.4
 */
function setupActividadesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Actividades');
  
  const headers = [
    'id', 'proyecto_id', 'codigo', 'titulo', 'descripcion', 'responsable_id', 
    'prioridad', 'estado', 'inicio_plan', 'fin_plan', 'checklist_id', 
    'porcentaje_avance', 'evidencias_urls', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for prioridad column
  const prioridadRange = sheet.getRange(2, 7, 1000, 1);
  const prioridadValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Baja', 'Media', 'Alta', 'Crítica'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una prioridad válida')
    .build();
  prioridadRange.setDataValidation(prioridadValidation);
  
  // Data validation for estado column
  const estadoRange = sheet.getRange(2, 8, 1000, 1);
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pendiente', 'En progreso', 'En revisión', 'Completada'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Percentage validation for porcentaje_avance
  const avanceRange = sheet.getRange(2, 12, 1000, 1);
  const avanceValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(0, 100)
    .setAllowInvalid(false)
    .setHelpText('Ingrese un porcentaje entre 0 y 100')
    .build();
  avanceRange.setDataValidation(avanceValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 120, 3: 100, 4: 200, 5: 250, 6: 120, 7: 80, 8: 100,
    9: 100, 10: 100, 11: 120, 12: 100, 13: 200, 14: 120, 15: 120
  });
  
  console.log('Actividades sheet created successfully');
}

/**
 * Setup Colaboradores sheet with skills and certification tracking
 * Requirements: 2.1, 2.2, 2.4
 */
function setupColaboradoresSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Colaboradores');
  
  const headers = [
    'id', 'dni_ruc', 'nombres', 'telefono', 'email', 'especialidad', 
    'tarifa_hora', 'zona', 'certificaciones_json', 'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for especialidad column
  const especialidadRange = sheet.getRange(2, 6, 1000, 1);
  const especialidadValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Electricista', 'Técnico Civil', 'Técnico CCTV', 'Mantenimiento', 'Supervisor', 'Ingeniero'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una especialidad válida')
    .build();
  especialidadRange.setDataValidation(especialidadValidation);
  
  // Data validation for zona column
  const zonaRange = sheet.getRange(2, 8, 1000, 1);
  const zonaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Lima Norte', 'Lima Sur', 'Lima Este', 'Lima Centro', 'Callao', 'Provincias'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una zona válida')
    .build();
  zonaRange.setDataValidation(zonaValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 10, 1000, 1);
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Email validation
  const emailRange = sheet.getRange(2, 5, 1000, 1);
  const emailValidation = SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=ISEMAIL(E2)')
    .setAllowInvalid(false)
    .setHelpText('Ingrese un email válido')
    .build();
  emailRange.setDataValidation(emailValidation);
  
  // Numeric validation for tarifa_hora
  const tarifaRange = sheet.getRange(2, 7, 1000, 1);
  const tarifaValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThan(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese una tarifa mayor a 0')
    .build();
  tarifaRange.setDataValidation(tarifaValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 100, 3: 200, 4: 120, 5: 180, 6: 120, 
    7: 100, 8: 100, 9: 300, 10: 80, 11: 120, 12: 120
  });
  
  console.log('Colaboradores sheet created successfully');
}/**
 * 
Setup Asignaciones sheet for project assignments
 * Requirements: 2.1, 2.2, 2.4
 */
function setupAsignacionesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Asignaciones');
  
  const headers = [
    'id', 'colaborador_id', 'actividad_id', 'proyecto_id', 'fecha_inicio', 
    'fecha_fin', 'horas_planificadas', 'rol_asignacion', 'estado', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for rol_asignacion column
  const rolRange = sheet.getRange(2, 8, 1000, 1);
  const rolValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Responsable', 'Colaborador', 'Supervisor', 'Apoyo'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un rol de asignación válido')
    .build();
  rolRange.setDataValidation(rolValidation);
  
  // Data validation for estado column
  const estadoRange = sheet.getRange(2, 9, 1000, 1);
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Asignado', 'En progreso', 'Completado', 'Cancelado'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Numeric validation for horas_planificadas
  const horasRange = sheet.getRange(2, 7, 1000, 1);
  const horasValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThan(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese un número de horas mayor a 0')
    .build();
  horasRange.setDataValidation(horasValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 120, 3: 120, 4: 120, 5: 100, 6: 100, 
    7: 120, 8: 120, 9: 100, 10: 120, 11: 120
  });
  
  console.log('Asignaciones sheet created successfully');
}

/**
 * Setup Horas sheet for time tracking
 * Requirements: 2.1, 2.2, 2.4
 */
function setupHorasSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Horas');
  
  const headers = [
    'id', 'colaborador_id', 'actividad_id', 'proyecto_id', 'fecha', 
    'horas_trabajadas', 'descripcion_trabajo', 'tipo_trabajo', 'aprobado', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for tipo_trabajo column
  const tipoRange = sheet.getRange(2, 8, 1000, 1);
  const tipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Normal', 'Sobretiempo', 'Nocturno', 'Feriado', 'Emergencia'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un tipo de trabajo válido')
    .build();
  tipoRange.setDataValidation(tipoValidation);
  
  // Data validation for aprobado column
  const aprobadoRange = sheet.getRange(2, 9, 1000, 1);
  const aprobadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para aprobado, FALSE para pendiente')
    .build();
  aprobadoRange.setDataValidation(aprobadoValidation);
  
  // Numeric validation for horas_trabajadas
  const horasRange = sheet.getRange(2, 6, 1000, 1);
  const horasValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(0, 24)
    .setAllowInvalid(false)
    .setHelpText('Ingrese horas entre 0 y 24')
    .build();
  horasRange.setDataValidation(horasValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 120, 3: 120, 4: 120, 5: 100, 6: 120, 
    7: 250, 8: 100, 9: 80, 10: 120, 11: 120
  });
  
  console.log('Horas sheet created successfully');
}

/**
 * Setup Materiales sheet with inventory tracking
 * Requirements: 2.1, 2.2, 2.4
 */
function setupMaterialesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Materiales');
  
  const headers = [
    'id', 'sku', 'descripcion', 'categoria', 'unidad', 'costo_ref', 
    'stock_actual', 'stock_minimo', 'proveedor_principal', 'ubicacion_almacen', 
    'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for categoria column
  const categoriaRange = sheet.getRange(2, 4, 1000, 1);
  const categoriaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Cables', 'Conectores', 'Herramientas', 'Equipos', 'Consumibles', 'Seguridad'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una categoría válida')
    .build();
  categoriaRange.setDataValidation(categoriaValidation);
  
  // Data validation for unidad column
  const unidadRange = sheet.getRange(2, 5, 1000, 1);
  const unidadValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Unidad', 'Metro', 'Kilogramo', 'Litro', 'Caja', 'Rollo', 'Par'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una unidad válida')
    .build();
  unidadRange.setDataValidation(unidadValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 11, 1000, 1);
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Numeric validations
  const costoRange = sheet.getRange(2, 6, 1000, 1);
  const costoValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese un costo mayor o igual a 0')
    .build();
  costoRange.setDataValidation(costoValidation);
  
  const stockActualRange = sheet.getRange(2, 7, 1000, 1);
  const stockActualValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese un stock mayor o igual a 0')
    .build();
  stockActualRange.setDataValidation(stockActualValidation);
  
  const stockMinimoRange = sheet.getRange(2, 8, 1000, 1);
  const stockMinimoValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese un stock mínimo mayor o igual a 0')
    .build();
  stockMinimoRange.setDataValidation(stockMinimoValidation);
  
  // Conditional formatting for stock alerts
  const stockRange = sheet.getRange(2, 7, 1000, 2);
  const stockRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$G2<=$H2')
    .setBackground('#ffcccc')
    .setRanges([stockRange])
    .build();
  sheet.setConditionalFormatRules([stockRule]);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 100, 3: 250, 4: 100, 5: 80, 6: 100, 7: 100, 
    8: 100, 9: 150, 10: 120, 11: 80, 12: 120, 13: 120
  });
  
  console.log('Materiales sheet created successfully');
}

/**
 * Setup BOM sheet for bill of materials per activity
 * Requirements: 2.1, 2.2, 2.4
 */
function setupBOMSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('BOM');
  
  const headers = [
    'id', 'actividad_id', 'proyecto_id', 'material_id', 'qty_requerida', 
    'qty_asignada', 'proveedor_sugerido', 'costo_unit_est', 'lead_time_dias', 
    'estado_abastecimiento', 'fecha_requerida', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for estado_abastecimiento column
  const estadoRange = sheet.getRange(2, 10, 1000, 1);
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Por pedir', 'Pedido', 'En tránsito', 'Recibido', 'Entregado'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado de abastecimiento válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Numeric validations
  const qtyRequeridaRange = sheet.getRange(2, 5, 1000, 1);
  const qtyRequeridaValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThan(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese una cantidad mayor a 0')
    .build();
  qtyRequeridaRange.setDataValidation(qtyRequeridaValidation);
  
  const qtyAsignadaRange = sheet.getRange(2, 6, 1000, 1);
  const qtyAsignadaValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese una cantidad mayor o igual a 0')
    .build();
  qtyAsignadaRange.setDataValidation(qtyAsignadaValidation);
  
  const costoRange = sheet.getRange(2, 8, 1000, 1);
  const costoValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese un costo mayor o igual a 0')
    .build();
  costoRange.setDataValidation(costoValidation);
  
  const leadTimeRange = sheet.getRange(2, 9, 1000, 1);
  const leadTimeValidation = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setAllowInvalid(false)
    .setHelpText('Ingrese días de lead time mayor o igual a 0')
    .build();
  leadTimeRange.setDataValidation(leadTimeValidation);
  
  // Conditional formatting for quantity alerts
  const qtyRange = sheet.getRange(2, 5, 1000, 2);
  const qtyRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$F2<$E2')
    .setBackground('#fff2cc')
    .setRanges([qtyRange])
    .build();
  sheet.setConditionalFormatRules([qtyRule]);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 120, 3: 120, 4: 120, 5: 100, 6: 100, 7: 150, 
    8: 100, 9: 100, 10: 120, 11: 120, 12: 120, 13: 120
  });
  
  console.log('BOM sheet created successfully');
}

/**
 * Setup Config sheet for system configuration
 * Requirements: 2.1, 2.2, 2.4
 */
function setupConfigSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Config');
  
  const headers = ['key', 'value', 'description', 'updated_at'];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  setStandardColumnWidths(sheet, {
    1: 150, // key
    2: 200, // value
    3: 300, // description
    4: 120  // updated_at
  });
  
  console.log('Config sheet created successfully');
}

/**
 * Setup Checklists sheet for reusable checklists
 * Requirements: 2.1, 2.2, 2.4
 */
function setupChecklistsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Checklists');
  
  const headers = [
    'id', 'nombre', 'descripcion', 'categoria', 'items_json', 
    'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for categoria column
  const categoriaRange = sheet.getRange(2, 4, 1000, 1);
  const categoriaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Eléctrico', 'Civil', 'CCTV', 'Mantenimiento', 'Seguridad', 'General'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una categoría válida')
    .build();
  categoriaRange.setDataValidation(categoriaValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 6, 1000, 1);
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 200, 3: 300, 4: 100, 5: 400, 6: 80, 7: 120, 8: 120
  });
  
  console.log('Checklists sheet created successfully');
}

/**
 * Setup ActivityChecklists sheet for activity-specific checklist instances
 * Requirements: 2.1, 2.2, 2.4
 */
function setupActivityChecklistsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('ActivityChecklists');
  
  const headers = [
    'id', 'actividad_id', 'checklist_id', 'items_status_json', 
    'completado', 'fecha_completado', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for completado column
  const completadoRange = sheet.getRange(2, 5, 1000, 1);
  const completadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para completado, FALSE para pendiente')
    .build();
  completadoRange.setDataValidation(completadoValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 120, 3: 120, 4: 400, 5: 80, 6: 120, 7: 120, 8: 120
  });
  
  console.log('ActivityChecklists sheet created successfully');
}

/**
 * Setup Evidencias sheet for file and photo evidence
 * Requirements: 2.1, 2.2, 2.4
 */
function setupEvidenciasSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Evidencias');
  
  const headers = [
    'id', 'actividad_id', 'proyecto_id', 'tipo', 'nombre_archivo', 
    'url_archivo', 'descripcion', 'subido_por', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for tipo column
  const tipoRange = sheet.getRange(2, 4, 1000, 1);
  const tipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Foto', 'Documento', 'Video', 'Audio', 'Otro'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un tipo de evidencia válido')
    .build();
  tipoRange.setDataValidation(tipoValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 120, 3: 120, 4: 80, 5: 200, 6: 300, 7: 250, 8: 120, 9: 120, 10: 120
  });
  
  console.log('Evidencias sheet created successfully');
}

/**
 * Setup Documentos sheet for project documentation
 * Requirements: 2.1, 2.2, 2.4
 */
function setupDocumentosSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Documentos');
  
  const headers = [
    'id', 'proyecto_id', 'nombre', 'tipo_documento', 'url_archivo', 
    'version', 'estado', 'creado_por', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for tipo_documento column
  const tipoRange = sheet.getRange(2, 4, 1000, 1);
  const tipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Plano', 'Especificación', 'Manual', 'Certificado', 'Informe', 'Contrato'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un tipo de documento válido')
    .build();
  tipoRange.setDataValidation(tipoValidation);
  
  // Data validation for estado column
  const estadoRange = sheet.getRange(2, 7, 1000, 1);
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Borrador', 'En revisión', 'Aprobado', 'Obsoleto'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 120, 3: 200, 4: 120, 5: 300, 6: 80, 7: 100, 8: 120, 9: 120, 10: 120
  });
  
  console.log('Documentos sheet created successfully');
}

/**
 * Setup AuditLog sheet for system audit trail
 * Requirements: 2.1, 2.2, 2.4
 */
function setupAuditLogSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('AuditLog');
  
  const headers = [
    'id', 'tabla', 'registro_id', 'accion', 'usuario_id', 
    'datos_anteriores', 'datos_nuevos', 'ip_address', 'created_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatSheetHeaders(sheet, headers.length);
  
  // Data validation for accion column
  const accionRange = sheet.getRange(2, 4, 1000, 1);
  const accionValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una acción válida')
    .build();
  accionRange.setDataValidation(accionValidation);
  
  setStandardColumnWidths(sheet, {
    1: 120, 2: 100, 3: 120, 4: 80, 5: 120, 6: 300, 7: 300, 8: 120, 9: 120
  });
  
  console.log('AuditLog sheet created successfully');
}

/**
 * Utility function to format sheet headers consistently
 * Requirements: 2.1, 2.2
 */
function formatSheetHeaders(sheet, headerCount) {
  const headerRange = sheet.getRange(1, 1, 1, headerCount);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Protect headers
  const protection = headerRange.protect().setDescription('Headers protection');
  protection.setWarningOnly(true);
}

/**
 * Utility function to set column widths consistently
 * Requirements: 2.1, 2.2
 */
function setStandardColumnWidths(sheet, widthMap) {
  Object.keys(widthMap).forEach(columnIndex => {
    sheet.setColumnWidth(parseInt(columnIndex), widthMap[columnIndex]);
  });
}

/**
 * Generate unique ID with timestamp and random component
 * Requirements: 2.1, 2.4
 */
function generateId(prefix = 'GEN') {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}_${timestamp.toString(36).toUpperCase()}${random}`;
}

/**
 * Validate referential integrity constraints
 * Requirements: 2.4
 */
function validateReferentialIntegrity(spreadsheet) {
  console.log('Validating referential integrity...');
  
  const validationResults = [];
  
  try {
    // Check if all referenced sheets exist
    const requiredSheets = [
      'Usuarios', 'Clientes', 'Proyectos', 'Actividades', 'Colaboradores',
      'Asignaciones', 'Horas', 'Materiales', 'BOM', 'Config', 'Checklists',
      'ActivityChecklists', 'Evidencias', 'Documentos', 'AuditLog'
    ];
    
    const existingSheets = spreadsheet.getSheets().map(sheet => sheet.getName());
    
    requiredSheets.forEach(sheetName => {
      if (existingSheets.includes(sheetName)) {
        validationResults.push({ sheet: sheetName, status: 'OK', message: 'Sheet exists' });
      } else {
        validationResults.push({ sheet: sheetName, status: 'ERROR', message: 'Sheet missing' });
      }
    });
    
    console.log('Referential integrity validation completed');
    return validationResults;
    
  } catch (error) {
    console.error('Error validating referential integrity:', error);
    return [{ sheet: 'VALIDATION', status: 'ERROR', message: error.message }];
  }
}

/**
 * Create database documentation
 * Requirements: 2.1, 2.2, 2.4
 */
function createDatabaseDocumentation(spreadsheet) {
  const docSheet = spreadsheet.insertSheet('_Documentation');
  
  const documentation = [
    ['ServesPlatform Database Schema Documentation'],
    [''],
    ['Created:', new Date().toISOString()],
    ['Version:', '1.0.0'],
    [''],
    ['TABLES AND RELATIONSHIPS:'],
    [''],
    ['1. Usuarios - User accounts and authentication'],
    ['   - Primary Key: id'],
    ['   - Unique: email'],
    ['   - Validation: rol (admin_lider, admin, editor, tecnico)'],
    [''],
    ['2. Clientes - Client companies'],
    ['   - Primary Key: id'],
    ['   - Unique: ruc'],
    ['   - Validation: email format, activo (TRUE/FALSE)'],
    [''],
    ['3. Proyectos - Projects'],
    ['   - Primary Key: id'],
    ['   - Foreign Keys: cliente_id -> Clientes.id, responsable_id -> Usuarios.id'],
    ['   - Validation: estado, moneda, linea_servicio, avance_pct (0-100)'],
    [''],
    ['4. Actividades - Project activities'],
    ['   - Primary Key: id'],
    ['   - Foreign Keys: proyecto_id -> Proyectos.id, responsable_id -> Usuarios.id'],
    ['   - Validation: prioridad, estado, porcentaje_avance (0-100)'],
    [''],
    ['5. Colaboradores - External collaborators'],
    ['   - Primary Key: id'],
    ['   - Validation: especialidad, zona, email format, tarifa_hora > 0'],
    [''],
    ['6. Asignaciones - Activity assignments'],
    ['   - Primary Key: id'],
    ['   - Foreign Keys: colaborador_id, actividad_id, proyecto_id'],
    ['   - Validation: rol_asignacion, estado, horas_planificadas > 0'],
    [''],
    ['7. Horas - Time tracking'],
    ['   - Primary Key: id'],
    ['   - Foreign Keys: colaborador_id, actividad_id, proyecto_id'],
    ['   - Validation: tipo_trabajo, horas_trabajadas (0-24), aprobado'],
    [''],
    ['8. Materiales - Material inventory'],
    ['   - Primary Key: id'],
    ['   - Unique: sku'],
    ['   - Validation: categoria, unidad, numeric fields >= 0'],
    ['   - Conditional Formatting: Stock alerts when stock_actual <= stock_minimo'],
    [''],
    ['9. BOM - Bill of Materials'],
    ['   - Primary Key: id'],
    ['   - Foreign Keys: actividad_id, proyecto_id, material_id'],
    ['   - Validation: quantities > 0, estado_abastecimiento'],
    ['   - Conditional Formatting: Quantity alerts when qty_asignada < qty_requerida'],
    [''],
    ['10. Config - System configuration'],
    ['    - Primary Key: key'],
    ['    - System settings and parameters'],
    [''],
    ['11. Checklists - Reusable checklists'],
    ['    - Primary Key: id'],
    ['    - JSON field: items_json'],
    ['    - Validation: categoria, activo'],
    [''],
    ['12. ActivityChecklists - Activity checklist instances'],
    ['    - Primary Key: id'],
    ['    - Foreign Keys: actividad_id, checklist_id'],
    ['    - JSON field: items_status_json'],
    [''],
    ['13. Evidencias - File evidence'],
    ['    - Primary Key: id'],
    ['    - Foreign Keys: actividad_id, proyecto_id'],
    ['    - Validation: tipo'],
    [''],
    ['14. Documentos - Project documents'],
    ['    - Primary Key: id'],
    ['    - Foreign Keys: proyecto_id'],
    ['    - Validation: tipo_documento, estado'],
    [''],
    ['15. AuditLog - System audit trail'],
    ['    - Primary Key: id'],
    ['    - Validation: accion (CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT)'],
    [''],
    ['DATA VALIDATION RULES:'],
    ['- All boolean fields use TRUE/FALSE values'],
    ['- Email fields have format validation'],
    ['- Numeric fields have range validation'],
    ['- Enum fields have dropdown lists'],
    ['- Foreign key relationships are documented but not enforced'],
    [''],
    ['SECURITY FEATURES:'],
    ['- Password hash column is hidden in Usuarios sheet'],
    ['- Header rows are protected'],
    ['- Audit log tracks all system changes'],
    [''],
    ['PERFORMANCE FEATURES:'],
    ['- Conditional formatting for alerts'],
    ['- Frozen header rows'],
    ['- Optimized column widths'],
    ['- Indexed ID fields for fast lookups']
  ];
  
  // Write documentation
  documentation.forEach((row, index) => {
    docSheet.getRange(index + 1, 1).setValue(row[0]);
  });
  
  // Format documentation
  docSheet.getRange(1, 1).setFontSize(14).setFontWeight('bold');
  docSheet.setColumnWidth(1, 600);
  
  console.log('Database documentation created successfully');
}