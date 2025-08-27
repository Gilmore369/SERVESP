/**
 * Database Setup Script for ServesPlatform
 * Creates and configures Google Sheets database structure
 */

/**
 * Main function to setup the complete database structure
 * Run this function once to create the ServesPlatform_DB spreadsheet
 */
function setupDatabase() {
  try {
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
    
    // Setup all sheets
    setupUsuariosSheet(spreadsheet);
    setupClientesSheet(spreadsheet);
    setupProyectosSheet(spreadsheet);
    setupActividadesSheet(spreadsheet);
    setupColaboradoresSheet(spreadsheet);
    setupAsignacionesSheet(spreadsheet);
    setupHorasSheet(spreadsheet);
    setupMaterialesSheet(spreadsheet);
    setupBOMSheet(spreadsheet);
    
    // Create additional utility sheets
    setupConfigSheet(spreadsheet);
    setupChecklistsSheet(spreadsheet);
    setupActivityChecklistsSheet(spreadsheet);
    setupEvidenciasSheet(spreadsheet);
    
    // Create documentation sheets
    setupDocumentosSheet(spreadsheet);
    setupCategoriaDocumentosSheet(spreadsheet);
    setupDocumentosProyectoSheet(spreadsheet);
    
    // Create audit log sheet
    setupAuditLogSheet(spreadsheet);
    
    console.log('Database setup completed successfully!');
    console.log('Please save this Spreadsheet ID for your Apps Script configuration:', spreadsheetId);
    
    return {
      success: true,
      spreadsheetId: spreadsheetId,
      url: spreadsheet.getUrl()
    };
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}
/**
 * 
Setup Usuarios sheet with authentication and role management
 */
function setupUsuariosSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Usuarios');
  
  // Headers
  const headers = [
    'id', 'email', 'nombre', 'rol', 'password_hash', 
    'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for rol column
  const rolRange = sheet.getRange(2, 4, 1000, 1); // Column D (rol)
  const rolValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['admin_lider', 'admin', 'editor', 'tecnico'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un rol válido')
    .build();
  rolRange.setDataValidation(rolValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 6, 1000, 1); // Column F (activo)
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Protect headers
  const protection = sheet.protect().setDescription('Usuarios sheet protection');
  const headerProtection = sheet.getRange(1, 1, 1, headers.length).protect();
  headerProtection.setDescription('Headers protection');
  
  // Hide password_hash column
  sheet.hideColumns(5); // Column E (password_hash)
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 200); // email
  sheet.setColumnWidth(3, 150); // nombre
  sheet.setColumnWidth(4, 100); // rol
  sheet.setColumnWidth(6, 80);  // activo
  sheet.setColumnWidth(7, 120); // created_at
  sheet.setColumnWidth(8, 120); // updated_at
  
  // Add sample admin user
  const passwordHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, 
    'admin123', 
    Utilities.Charset.UTF_8
  ).map(byte => (byte + 256) % 256)
   .map(byte => byte.toString(16).padStart(2, '0'))
   .join('');
   
  const sampleData = [
    ['USR_' + generateId(), 'admin@servesplatform.com', 'Administrador', 'admin_lider', 
     passwordHash, 'TRUE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Usuarios sheet created successfully');
}/*
*
 * Setup Clientes sheet for company information
 */
function setupClientesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Clientes');
  
  // Headers
  const headers = [
    'id', 'ruc', 'razon_social', 'nombre_comercial', 'direccion', 
    'telefono', 'email', 'contacto_principal', 'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 9, 1000, 1); // Column I (activo)
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 120); // ruc
  sheet.setColumnWidth(3, 200); // razon_social
  sheet.setColumnWidth(4, 150); // nombre_comercial
  sheet.setColumnWidth(5, 200); // direccion
  sheet.setColumnWidth(6, 120); // telefono
  sheet.setColumnWidth(7, 180); // email
  sheet.setColumnWidth(8, 150); // contacto_principal
  sheet.setColumnWidth(9, 80);  // activo
  sheet.setColumnWidth(10, 120); // created_at
  sheet.setColumnWidth(11, 120); // updated_at
  
  // Add sample client
  const sampleData = [
    ['CLI_' + generateId(), '20123456789', 'Empresa Demo S.A.C.', 'Demo Corp', 
     'Av. Principal 123, Lima', '01-234-5678', 'contacto@demo.com', 
     'Juan Pérez', 'TRUE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Clientes sheet created successfully');
}

/**
 * Generate unique ID with timestamp
 */
function generateId() {
  const timestamp = new Date().getTime();
  return timestamp.toString(36).toUpperCase();
}/**
 
* Setup Proyectos sheet with project lifecycle fields
 */
function setupProyectosSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Proyectos');
  
  // Headers
  const headers = [
    'id', 'codigo', 'nombre', 'cliente_id', 'responsable_id', 'ubicacion', 
    'descripcion', 'linea_servicio', 'sla_objetivo', 'inicio_plan', 'fin_plan', 
    'presupuesto_total', 'moneda', 'estado', 'avance_pct', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for estado column
  const estadoRange = sheet.getRange(2, 14, 1000, 1); // Column N (estado)
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Planificación', 'En progreso', 'Pausado', 'Cerrado'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Data validation for moneda column
  const monedaRange = sheet.getRange(2, 13, 1000, 1); // Column M (moneda)
  const monedaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['PEN', 'USD'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una moneda válida')
    .build();
  monedaRange.setDataValidation(monedaValidation);
  
  // Data validation for linea_servicio column
  const lineaRange = sheet.getRange(2, 8, 1000, 1); // Column H (linea_servicio)
  const lineaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Eléctrico', 'Civil', 'CCTV', 'Mantenimiento', 'Telecomunicaciones'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una línea de servicio válida')
    .build();
  lineaRange.setDataValidation(lineaValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 100); // codigo
  sheet.setColumnWidth(3, 200); // nombre
  sheet.setColumnWidth(4, 120); // cliente_id
  sheet.setColumnWidth(5, 120); // responsable_id
  sheet.setColumnWidth(6, 150); // ubicacion
  sheet.setColumnWidth(7, 250); // descripcion
  sheet.setColumnWidth(8, 120); // linea_servicio
  sheet.setColumnWidth(9, 80);  // sla_objetivo
  sheet.setColumnWidth(10, 100); // inicio_plan
  sheet.setColumnWidth(11, 100); // fin_plan
  sheet.setColumnWidth(12, 120); // presupuesto_total
  sheet.setColumnWidth(13, 80);  // moneda
  sheet.setColumnWidth(14, 100); // estado
  sheet.setColumnWidth(15, 80);  // avance_pct
  sheet.setColumnWidth(16, 120); // created_at
  sheet.setColumnWidth(17, 120); // updated_at
  
  // Add sample project
  const sampleData = [
    ['PRY_' + generateId(), 'PRY-001', 'Instalación Sistema Eléctrico', 'CLI_' + generateId(), 
     'USR_' + generateId(), 'Lima Centro', 'Instalación completa de sistema eléctrico industrial', 
     'Eléctrico', 30, new Date(), new Date(Date.now() + 30*24*60*60*1000), 
     50000, 'PEN', 'Planificación', 0, new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Proyectos sheet created successfully');
}/**
 * S
etup Actividades sheet with WBS structure
 */
function setupActividadesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Actividades');
  
  // Headers
  const headers = [
    'id', 'proyecto_id', 'codigo', 'titulo', 'descripcion', 'responsable_id', 
    'prioridad', 'estado', 'inicio_plan', 'fin_plan', 'checklist_id', 
    'porcentaje_avance', 'evidencias_urls', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for prioridad column
  const prioridadRange = sheet.getRange(2, 7, 1000, 1); // Column G (prioridad)
  const prioridadValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Baja', 'Media', 'Alta', 'Crítica'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una prioridad válida')
    .build();
  prioridadRange.setDataValidation(prioridadValidation);
  
  // Data validation for estado column
  const estadoRange = sheet.getRange(2, 8, 1000, 1); // Column H (estado)
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pendiente', 'En progreso', 'En revisión', 'Completada'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 120); // proyecto_id
  sheet.setColumnWidth(3, 100); // codigo
  sheet.setColumnWidth(4, 200); // titulo
  sheet.setColumnWidth(5, 250); // descripcion
  sheet.setColumnWidth(6, 120); // responsable_id
  sheet.setColumnWidth(7, 80);  // prioridad
  sheet.setColumnWidth(8, 100); // estado
  sheet.setColumnWidth(9, 100); // inicio_plan
  sheet.setColumnWidth(10, 100); // fin_plan
  sheet.setColumnWidth(11, 120); // checklist_id
  sheet.setColumnWidth(12, 100); // porcentaje_avance
  sheet.setColumnWidth(13, 200); // evidencias_urls
  sheet.setColumnWidth(14, 120); // created_at
  sheet.setColumnWidth(15, 120); // updated_at
  
  // Add sample activity
  const sampleData = [
    ['ACT_' + generateId(), 'PRY_' + generateId(), 'ACT-001', 'Análisis de Requerimientos', 
     'Análisis detallado de los requerimientos del cliente', 'USR_' + generateId(), 
     'Alta', 'Pendiente', new Date(), new Date(Date.now() + 7*24*60*60*1000), 
     'CHK_001', 0, '', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Actividades sheet created successfully');
}/**
 * Se
tup Colaboradores sheet with skills and certification tracking
 */
function setupColaboradoresSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Colaboradores');
  
  // Headers
  const headers = [
    'id', 'dni_ruc', 'nombres', 'telefono', 'email', 'especialidad', 
    'tarifa_hora', 'zona', 'certificaciones_json', 'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for especialidad column
  const especialidadRange = sheet.getRange(2, 6, 1000, 1); // Column F (especialidad)
  const especialidadValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Electricista', 'Técnico Civil', 'Técnico CCTV', 'Mantenimiento', 'Supervisor', 'Ingeniero'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una especialidad válida')
    .build();
  especialidadRange.setDataValidation(especialidadValidation);
  
  // Data validation for zona column
  const zonaRange = sheet.getRange(2, 8, 1000, 1); // Column H (zona)
  const zonaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Lima Norte', 'Lima Sur', 'Lima Este', 'Lima Centro', 'Callao', 'Provincias'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una zona válida')
    .build();
  zonaRange.setDataValidation(zonaValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 10, 1000, 1); // Column J (activo)
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 100); // dni_ruc
  sheet.setColumnWidth(3, 200); // nombres
  sheet.setColumnWidth(4, 120); // telefono
  sheet.setColumnWidth(5, 180); // email
  sheet.setColumnWidth(6, 120); // especialidad
  sheet.setColumnWidth(7, 100); // tarifa_hora
  sheet.setColumnWidth(8, 100); // zona
  sheet.setColumnWidth(9, 300); // certificaciones_json
  sheet.setColumnWidth(10, 80); // activo
  sheet.setColumnWidth(11, 120); // created_at
  sheet.setColumnWidth(12, 120); // updated_at
  
  // Add sample collaborator
  const certificaciones = JSON.stringify([
    {"tipo": "Certificación Eléctrica", "vencimiento": "2025-12-31"},
    {"tipo": "Seguridad Industrial", "vencimiento": "2025-06-30"}
  ]);
  
  const sampleData = [
    ['COL_' + generateId(), '12345678', 'Juan Carlos Pérez López', '987654321', 
     'juan.perez@email.com', 'Electricista', 25.50, 'Lima Centro', 
     certificaciones, 'TRUE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Colaboradores sheet created successfully');
}/*
*
 * Setup Asignaciones sheet for project assignments
 */
function setupAsignacionesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Asignaciones');
  
  // Headers
  const headers = [
    'id', 'colaborador_id', 'actividad_id', 'proyecto_id', 'fecha_inicio', 
    'fecha_fin', 'horas_planificadas', 'rol_asignacion', 'estado', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for rol_asignacion column
  const rolRange = sheet.getRange(2, 8, 1000, 1); // Column H (rol_asignacion)
  const rolValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Responsable', 'Colaborador', 'Supervisor', 'Apoyo'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un rol de asignación válido')
    .build();
  rolRange.setDataValidation(rolValidation);
  
  // Data validation for estado column
  const estadoRange = sheet.getRange(2, 9, 1000, 1); // Column I (estado)
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Asignado', 'En progreso', 'Completado', 'Cancelado'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 120); // colaborador_id
  sheet.setColumnWidth(3, 120); // actividad_id
  sheet.setColumnWidth(4, 120); // proyecto_id
  sheet.setColumnWidth(5, 100); // fecha_inicio
  sheet.setColumnWidth(6, 100); // fecha_fin
  sheet.setColumnWidth(7, 120); // horas_planificadas
  sheet.setColumnWidth(8, 120); // rol_asignacion
  sheet.setColumnWidth(9, 100); // estado
  sheet.setColumnWidth(10, 120); // created_at
  sheet.setColumnWidth(11, 120); // updated_at
  
  // Add sample assignment
  const sampleData = [
    ['ASG_' + generateId(), 'COL_' + generateId(), 'ACT_' + generateId(), 'PRY_' + generateId(), 
     new Date(), new Date(Date.now() + 7*24*60*60*1000), 40, 'Responsable', 
     'Asignado', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Asignaciones sheet created successfully');
}/**
 *
 Setup Horas sheet for time tracking
 */
function setupHorasSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Horas');
  
  // Headers
  const headers = [
    'id', 'colaborador_id', 'actividad_id', 'proyecto_id', 'fecha', 
    'horas_trabajadas', 'descripcion_trabajo', 'tipo_trabajo', 'aprobado', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for tipo_trabajo column
  const tipoRange = sheet.getRange(2, 8, 1000, 1); // Column H (tipo_trabajo)
  const tipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Normal', 'Sobretiempo', 'Nocturno', 'Feriado', 'Emergencia'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un tipo de trabajo válido')
    .build();
  tipoRange.setDataValidation(tipoValidation);
  
  // Data validation for aprobado column
  const aprobadoRange = sheet.getRange(2, 9, 1000, 1); // Column I (aprobado)
  const aprobadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para aprobado, FALSE para pendiente')
    .build();
  aprobadoRange.setDataValidation(aprobadoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 120); // colaborador_id
  sheet.setColumnWidth(3, 120); // actividad_id
  sheet.setColumnWidth(4, 120); // proyecto_id
  sheet.setColumnWidth(5, 100); // fecha
  sheet.setColumnWidth(6, 120); // horas_trabajadas
  sheet.setColumnWidth(7, 250); // descripcion_trabajo
  sheet.setColumnWidth(8, 100); // tipo_trabajo
  sheet.setColumnWidth(9, 80);  // aprobado
  sheet.setColumnWidth(10, 120); // created_at
  sheet.setColumnWidth(11, 120); // updated_at
  
  // Add sample time entry
  const sampleData = [
    ['HOR_' + generateId(), 'COL_' + generateId(), 'ACT_' + generateId(), 'PRY_' + generateId(), 
     new Date(), 8, 'Instalación de cableado eléctrico principal', 'Normal', 
     'FALSE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Horas sheet created successfully');
}/**
 * Se
tup Materiales sheet with inventory tracking
 */
function setupMaterialesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Materiales');
  
  // Headers
  const headers = [
    'id', 'sku', 'descripcion', 'categoria', 'unidad', 'costo_ref', 
    'stock_actual', 'stock_minimo', 'proveedor_principal', 'ubicacion_almacen', 
    'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for categoria column
  const categoriaRange = sheet.getRange(2, 4, 1000, 1); // Column D (categoria)
  const categoriaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Cables', 'Conectores', 'Herramientas', 'Equipos', 'Consumibles', 'Seguridad'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una categoría válida')
    .build();
  categoriaRange.setDataValidation(categoriaValidation);
  
  // Data validation for unidad column
  const unidadRange = sheet.getRange(2, 5, 1000, 1); // Column E (unidad)
  const unidadValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Unidad', 'Metro', 'Kilogramo', 'Litro', 'Caja', 'Rollo', 'Par'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una unidad válida')
    .build();
  unidadRange.setDataValidation(unidadValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 11, 1000, 1); // Column K (activo)
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Conditional formatting for stock alerts
  const stockRange = sheet.getRange(2, 7, 1000, 2); // Columns G-H (stock_actual, stock_minimo)
  const stockRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$G2<=$H2')
    .setBackground('#ffcccc')
    .setRanges([stockRange])
    .build();
  sheet.setConditionalFormatRules([stockRule]);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 100); // sku
  sheet.setColumnWidth(3, 250); // descripcion
  sheet.setColumnWidth(4, 100); // categoria
  sheet.setColumnWidth(5, 80);  // unidad
  sheet.setColumnWidth(6, 100); // costo_ref
  sheet.setColumnWidth(7, 100); // stock_actual
  sheet.setColumnWidth(8, 100); // stock_minimo
  sheet.setColumnWidth(9, 150); // proveedor_principal
  sheet.setColumnWidth(10, 120); // ubicacion_almacen
  sheet.setColumnWidth(11, 80); // activo
  sheet.setColumnWidth(12, 120); // created_at
  sheet.setColumnWidth(13, 120); // updated_at
  
  // Add sample materials
  const sampleData = [
    ['MAT_' + generateId(), 'CBL-001', 'Cable THW 12 AWG', 'Cables', 'Metro', 
     2.50, 500, 100, 'Proveedor ABC', 'Almacén A-1', 'TRUE', new Date(), new Date()],
    ['MAT_' + generateId(), 'CNT-001', 'Conector MC4 Macho', 'Conectores', 'Unidad', 
     15.00, 50, 20, 'Proveedor XYZ', 'Almacén B-2', 'TRUE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  console.log('Materiales sheet created successfully');
}/**

 * Setup BOM sheet for bill of materials per activity
 */
function setupBOMSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('BOM');
  
  // Headers
  const headers = [
    'id', 'actividad_id', 'proyecto_id', 'material_id', 'qty_requerida', 
    'qty_asignada', 'proveedor_sugerido', 'costo_unit_est', 'lead_time_dias', 
    'estado_abastecimiento', 'fecha_requerida', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for estado_abastecimiento column
  const estadoRange = sheet.getRange(2, 10, 1000, 1); // Column J (estado_abastecimiento)
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Por pedir', 'Pedido', 'En tránsito', 'Recibido', 'Entregado'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado de abastecimiento válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Conditional formatting for quantity alerts
  const qtyRange = sheet.getRange(2, 5, 1000, 2); // Columns E-F (qty_requerida, qty_asignada)
  const qtyRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$F2<$E2')
    .setBackground('#fff2cc')
    .setRanges([qtyRange])
    .build();
  sheet.setConditionalFormatRules([qtyRule]);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 120); // actividad_id
  sheet.setColumnWidth(3, 120); // proyecto_id
  sheet.setColumnWidth(4, 120); // material_id
  sheet.setColumnWidth(5, 100); // qty_requerida
  sheet.setColumnWidth(6, 100); // qty_asignada
  sheet.setColumnWidth(7, 150); // proveedor_sugerido
  sheet.setColumnWidth(8, 100); // costo_unit_est
  sheet.setColumnWidth(9, 100); // lead_time_dias
  sheet.setColumnWidth(10, 120); // estado_abastecimiento
  sheet.setColumnWidth(11, 120); // fecha_requerida
  sheet.setColumnWidth(12, 120); // created_at
  sheet.setColumnWidth(13, 120); // updated_at
  
  // Add sample BOM entries
  const sampleData = [
    ['BOM_' + generateId(), 'ACT_' + generateId(), 'PRY_' + generateId(), 'MAT_' + generateId(), 
     100, 0, 'Proveedor ABC', 2.50, 5, 'Por pedir', 
     new Date(Date.now() + 7*24*60*60*1000), new Date(), new Date()],
    ['BOM_' + generateId(), 'ACT_' + generateId(), 'PRY_' + generateId(), 'MAT_' + generateId(), 
     25, 25, 'Proveedor XYZ', 15.00, 3, 'Entregado', 
     new Date(), new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  console.log('BOM sheet created successfully');
}/**

 * Setup Config sheet for system configuration
 */
function setupConfigSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Config');
  
  // Headers
  const headers = ['key', 'value', 'description', 'updated_at'];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Set column widths
  sheet.setColumnWidth(1, 150); // key
  sheet.setColumnWidth(2, 200); // value
  sheet.setColumnWidth(3, 300); // description
  sheet.setColumnWidth(4, 120); // updated_at
  
  // Add default configuration
  const configData = [
    ['timezone', 'America/Lima', 'Zona horaria del sistema', new Date()],
    ['currency_default', 'PEN', 'Moneda por defecto', new Date()],
    ['project_code_prefix', 'PRY-', 'Prefijo para códigos de proyecto', new Date()],
    ['activity_code_prefix', 'ACT-', 'Prefijo para códigos de actividad', new Date()],
    ['sla_alert_days', '3', 'Días de anticipación para alertas de SLA', new Date()]
  ];
  
  sheet.getRange(2, 1, configData.length, headers.length).setValues(configData);
  
  console.log('Config sheet created successfully');
}

/**
 * Setup Checklists sheet for reusable checklists
 */
function setupChecklistsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Checklists');
  
  // Headers
  const headers = [
    'id', 'nombre', 'descripcion', 'categoria', 'items_json', 
    'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for categoria column
  const categoriaRange = sheet.getRange(2, 4, 1000, 1); // Column D (categoria)
  const categoriaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Eléctrico', 'Civil', 'CCTV', 'Mantenimiento', 'Seguridad', 'General'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione una categoría válida')
    .build();
  categoriaRange.setDataValidation(categoriaValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 6, 1000, 1); // Column F (activo)
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 200); // nombre
  sheet.setColumnWidth(3, 250); // descripcion
  sheet.setColumnWidth(4, 100); // categoria
  sheet.setColumnWidth(5, 400); // items_json
  sheet.setColumnWidth(6, 80);  // activo
  sheet.setColumnWidth(7, 120); // created_at
  sheet.setColumnWidth(8, 120); // updated_at
  
  // Add sample checklist
  const checklistItems = JSON.stringify([
    {"item": "Verificar planos eléctricos", "completado": false},
    {"item": "Revisar materiales disponibles", "completado": false},
    {"item": "Confirmar medidas de seguridad", "completado": false},
    {"item": "Documentar instalación", "completado": false}
  ]);
  
  const sampleData = [
    ['CHK_001', 'Checklist Instalación Eléctrica', 'Lista de verificación para instalaciones eléctricas', 
     'Eléctrico', checklistItems, 'TRUE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Checklists sheet created successfully');
}
/**
 
* Setup ActivityChecklists sheet for activity checklist instances
 */
function setupActivityChecklistsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('ActivityChecklists');
  
  // Headers
  const headers = [
    'id', 'actividad_id', 'checklist_id', 'items_estado_json', 
    'completado', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for completado column
  const completadoRange = sheet.getRange(2, 5, 1000, 1); // Column E (completado)
  const completadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para completado, FALSE para pendiente')
    .build();
  completadoRange.setDataValidation(completadoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 120); // actividad_id
  sheet.setColumnWidth(3, 120); // checklist_id
  sheet.setColumnWidth(4, 300); // items_estado_json
  sheet.setColumnWidth(5, 100); // completado
  sheet.setColumnWidth(6, 120); // created_at
  sheet.setColumnWidth(7, 120); // updated_at
  
  console.log('ActivityChecklists sheet created successfully');
}

/**
 * Setup Evidencias sheet for activity evidence
 */
function setupEvidenciasSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Evidencias');
  
  // Headers
  const headers = [
    'id', 'actividad_id', 'tipo', 'titulo', 'descripcion', 
    'url', 'usuario_id', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for tipo column
  const tipoRange = sheet.getRange(2, 3, 1000, 1); // Column C (tipo)
  const tipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['foto', 'documento', 'video', 'otro'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un tipo de evidencia válido')
    .build();
  tipoRange.setDataValidation(tipoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 120); // actividad_id
  sheet.setColumnWidth(3, 100); // tipo
  sheet.setColumnWidth(4, 200); // titulo
  sheet.setColumnWidth(5, 250); // descripcion
  sheet.setColumnWidth(6, 300); // url
  sheet.setColumnWidth(7, 120); // usuario_id
  sheet.setColumnWidth(8, 120); // created_at
  sheet.setColumnWidth(9, 120); // updated_at
  
  console.log('Evidencias sheet created successfully');
}
/
**
 * Get sheet by table name
 */
function getSheet(tableName) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  
  // Map table names to sheet names
  const sheetMapping = {
    'Usuarios': 'Usuarios',
    'Clientes': 'Clientes', 
    'Proyectos': 'Proyectos',
    'Actividades': 'Actividades',
    'Colaboradores': 'Colaboradores',
    'Asignaciones': 'Asignaciones',
    'Horas': 'Horas',
    'Materiales': 'Materiales',
    'BOM': 'BOM',
    'Checklists': 'Checklists',
    'ActivityChecklists': 'ActivityChecklists',
    'Evidencias': 'Evidencias',
    'Config': 'Config'
  };
  
  const sheetName = sheetMapping[tableName];
  if (!sheetName) {
    throw new Error(`Unknown table: ${tableName}`);
  }
  
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet not found: ${sheetName}`);
  }
  
  return sheet;
}

/**
 * Get all data from sheet as array of objects
 */
function getSheetData(sheet) {
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length === 0) {
    return [];
  }
  
  const headers = values[0];
  const data = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const record = {};
    
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      let value = row[j];
      
      // Convert date objects to ISO strings
      if (value instanceof Date) {
        value = value.toISOString();
      }
      
      // Convert boolean strings to actual booleans
      if (value === 'TRUE') {
        value = true;
      } else if (value === 'FALSE') {
        value = false;
      }
      
      record[header] = value;
    }
    
    data.push(record);
  }
  
  return data;
}

/**
 * Insert new record into sheet
 */
function insertRecord(sheet, record) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = [];
  
  // Build values array in header order
  for (const header of headers) {
    let value = record[header] || '';
    
    // Convert booleans to string for sheets
    if (typeof value === 'boolean') {
      value = value ? 'TRUE' : 'FALSE';
    }
    
    values.push(value);
  }
  
  // Insert at the end
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, 1, values.length).setValues([values]);
  
  return record;
}

/**
 * Update existing record in sheet
 */
function updateRecord(sheet, id, updates) {
  const data = getSheetData(sheet);
  const recordIndex = data.findIndex(r => r.id === id);
  
  if (recordIndex === -1) {
    throw new Error('Record not found');
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowNumber = recordIndex + 2; // +1 for header, +1 for 0-based index
  
  // Update timestamps
  addTimestamps(updates, true);
  
  // Update each field
  for (const [field, value] of Object.entries(updates)) {
    const columnIndex = headers.indexOf(field);
    if (columnIndex !== -1) {
      let cellValue = value;
      
      // Convert booleans to string for sheets
      if (typeof cellValue === 'boolean') {
        cellValue = cellValue ? 'TRUE' : 'FALSE';
      }
      
      sheet.getRange(rowNumber, columnIndex + 1).setValue(cellValue);
    }
  }
  
  // Return updated record
  const updatedRecord = { ...data[recordIndex], ...updates };
  return updatedRecord;
}

/**
 * Delete record from sheet
 */
function deleteRecord(sheet, id) {
  const data = getSheetData(sheet);
  const recordIndex = data.findIndex(r => r.id === id);
  
  if (recordIndex === -1) {
    throw new Error('Record not found');
  }
  
  const rowNumber = recordIndex + 2; // +1 for header, +1 for 0-based index
  sheet.deleteRow(rowNumber);
  
  return { success: true };
}

/**
 * Generate unique ID with table prefix
 */
function generateId(tableName = '') {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Table prefixes
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
    'ActivityChecklists': 'ACL',
    'Evidencias': 'EVD',
    'Config': 'CFG'
  };
  
  const prefix = prefixes[tableName] || 'GEN';
  return `${prefix}_${timestamp.toString(36).toUpperCase()}_${random}`;
}

/**
 * Add timestamps to record
 */
function addTimestamps(record, isUpdate = false) {
  const now = new Date();
  
  if (!isUpdate) {
    record.created_at = now;
  }
  record.updated_at = now;
  
  return record;
}
/**

 * Setup Documentos sheet for SOP documentation with Markdown support
 */
function setupDocumentosSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Documentos');
  
  // Headers
  const headers = [
    'id', 'titulo', 'tipo', 'categoria', 'contenido_markdown', 'tags', 
    'autor_id', 'version', 'estado', 'fecha_aprobacion', 'aprobado_por', 
    'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for tipo column
  const tipoRange = sheet.getRange(2, 3, 1000, 1); // Column C (tipo)
  const tipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['SOP', 'Manual', 'Procedimiento', 'Política', 'Otro'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un tipo de documento válido')
    .build();
  tipoRange.setDataValidation(tipoValidation);
  
  // Data validation for estado column
  const estadoRange = sheet.getRange(2, 9, 1000, 1); // Column I (estado)
  const estadoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Borrador', 'Revisión', 'Aprobado', 'Obsoleto'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un estado válido')
    .build();
  estadoRange.setDataValidation(estadoValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 12, 1000, 1); // Column L (activo)
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 250); // titulo
  sheet.setColumnWidth(3, 100); // tipo
  sheet.setColumnWidth(4, 120); // categoria
  sheet.setColumnWidth(5, 400); // contenido_markdown
  sheet.setColumnWidth(6, 200); // tags
  sheet.setColumnWidth(7, 120); // autor_id
  sheet.setColumnWidth(8, 80);  // version
  sheet.setColumnWidth(9, 100); // estado
  sheet.setColumnWidth(10, 120); // fecha_aprobacion
  sheet.setColumnWidth(11, 120); // aprobado_por
  sheet.setColumnWidth(12, 80); // activo
  sheet.setColumnWidth(13, 120); // created_at
  sheet.setColumnWidth(14, 120); // updated_at
  
  // Add sample document
  const sampleMarkdown = `# Procedimiento de Instalación Eléctrica

## Objetivo
Este documento describe el procedimiento estándar para la instalación de sistemas eléctricos.

## Alcance
Aplica a todas las instalaciones eléctricas residenciales e industriales.

## Procedimiento

### 1. Preparación
- Verificar planos eléctricos
- Revisar materiales necesarios
- Confirmar herramientas disponibles

### 2. Instalación
1. **Cableado principal**
   - Instalar canaletas
   - Tender cables según planos
   - Verificar continuidad

2. **Conexiones**
   - Realizar conexiones en tableros
   - Instalar interruptores y tomacorrientes
   - Verificar polaridad

### 3. Pruebas
- Medición de resistencia de aislamiento
- Prueba de funcionamiento
- Documentar resultados

## Seguridad
⚠️ **IMPORTANTE**: Siempre desconectar la energía antes de trabajar.

## Referencias
- Código Nacional de Electricidad
- Normas técnicas internas`;

  const sampleData = [
    ['DOC_' + generateId(), 'Procedimiento de Instalación Eléctrica', 'SOP', 'CAT_001', 
     sampleMarkdown, 'instalación,eléctrico,procedimiento,seguridad', 'USR_' + generateId(), 
     '1.0', 'Aprobado', new Date(), 'USR_' + generateId(), 'TRUE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, 1, headers.length).setValues(sampleData);
  
  console.log('Documentos sheet created successfully');
}

/**
 * Setup CategoriaDocumentos sheet for document categories
 */
function setupCategoriaDocumentosSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('CategoriaDocumentos');
  
  // Headers
  const headers = [
    'id', 'nombre', 'descripcion', 'color', 'icono', 
    'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for color column
  const colorRange = sheet.getRange(2, 4, 1000, 1); // Column D (color)
  const colorValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo', 'gray'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un color válido')
    .build();
  colorRange.setDataValidation(colorValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 6, 1000, 1); // Column F (activo)
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 200); // nombre
  sheet.setColumnWidth(3, 300); // descripcion
  sheet.setColumnWidth(4, 80);  // color
  sheet.setColumnWidth(5, 80);  // icono
  sheet.setColumnWidth(6, 80);  // activo
  sheet.setColumnWidth(7, 120); // created_at
  sheet.setColumnWidth(8, 120); // updated_at
  
  // Add sample categories
  const sampleData = [
    ['CAT_001', 'Procedimientos Operativos', 'SOPs y procedimientos de trabajo estándar', 'blue', '📋', 'TRUE', new Date(), new Date()],
    ['CAT_002', 'Manuales Técnicos', 'Manuales de equipos y sistemas', 'green', '📖', 'TRUE', new Date(), new Date()],
    ['CAT_003', 'Políticas de Seguridad', 'Políticas y normas de seguridad', 'red', '🛡️', 'TRUE', new Date(), new Date()],
    ['CAT_004', 'Capacitación', 'Materiales de entrenamiento y capacitación', 'purple', '🎓', 'TRUE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  console.log('CategoriaDocumentos sheet created successfully');
}

/**
 * Setup DocumentosProyecto sheet for project document management with URLs
 */
function setupDocumentosProyectoSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('DocumentosProyecto');
  
  // Headers
  const headers = [
    'id', 'proyecto_id', 'titulo', 'descripcion', 'tipo', 'url', 
    'fecha_documento', 'usuario_id', 'activo', 'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Data validation for tipo column
  const tipoRange = sheet.getRange(2, 5, 1000, 1); // Column E (tipo)
  const tipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Contrato', 'Plano', 'Especificación', 'Certificado', 'Foto', 'Reporte', 'Otro'])
    .setAllowInvalid(false)
    .setHelpText('Seleccione un tipo de documento válido')
    .build();
  tipoRange.setDataValidation(tipoValidation);
  
  // Data validation for activo column
  const activoRange = sheet.getRange(2, 9, 1000, 1); // Column I (activo)
  const activoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'])
    .setAllowInvalid(false)
    .setHelpText('TRUE para activo, FALSE para inactivo')
    .build();
  activoRange.setDataValidation(activoValidation);
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 120); // proyecto_id
  sheet.setColumnWidth(3, 250); // titulo
  sheet.setColumnWidth(4, 300); // descripcion
  sheet.setColumnWidth(5, 100); // tipo
  sheet.setColumnWidth(6, 400); // url
  sheet.setColumnWidth(7, 120); // fecha_documento
  sheet.setColumnWidth(8, 120); // usuario_id
  sheet.setColumnWidth(9, 80);  // activo
  sheet.setColumnWidth(10, 120); // created_at
  sheet.setColumnWidth(11, 120); // updated_at
  
  // Add sample project documents
  const sampleData = [
    ['PDOC_' + generateId(), 'PRY_' + generateId(), 'Contrato Principal del Proyecto', 
     'Contrato firmado con el cliente para la ejecución del proyecto', 'Contrato', 
     'https://drive.google.com/file/d/1234567890/view', new Date(), 'USR_' + generateId(), 
     'TRUE', new Date(), new Date()],
    ['PDOC_' + generateId(), 'PRY_' + generateId(), 'Planos Eléctricos Actualizados', 
     'Planos técnicos con las últimas modificaciones aprobadas', 'Plano', 
     'https://drive.google.com/file/d/0987654321/view', new Date(), 'USR_' + generateId(), 
     'TRUE', new Date(), new Date()]
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  console.log('DocumentosProyecto sheet created successfully');
}
/
**
 * Setup AuditLog sheet for tracking user actions and system events
 */
function setupAuditLogSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('AuditLog');
  
  // Define headers
  const headers = [
    'id',
    'usuario_id',
    'usuario_nombre',
    'accion',
    'recurso_tipo',
    'recurso_id',
    'recurso_nombre',
    'detalles_json',
    'ip_address',
    'user_agent',
    'timestamp',
    'created_at',
    'updated_at'
  ];
  
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  
  // Set column widths
  sheet.setColumnWidth(1, 120);  // id
  sheet.setColumnWidth(2, 120);  // usuario_id
  sheet.setColumnWidth(3, 150);  // usuario_nombre
  sheet.setColumnWidth(4, 120);  // accion
  sheet.setColumnWidth(5, 100);  // recurso_tipo
  sheet.setColumnWidth(6, 120);  // recurso_id
  sheet.setColumnWidth(7, 150);  // recurso_nombre
  sheet.setColumnWidth(8, 200);  // detalles_json
  sheet.setColumnWidth(9, 100);  // ip_address
  sheet.setColumnWidth(10, 150); // user_agent
  sheet.setColumnWidth(11, 150); // timestamp
  sheet.setColumnWidth(12, 120); // created_at
  sheet.setColumnWidth(13, 120); // updated_at
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Add data validation for accion column
  const accionRange = sheet.getRange(2, 4, 1000, 1); // Column D (accion)
  const accionValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'user_login',
      'user_logout',
      'login_failed',
      'user_created',
      'user_updated',
      'user_deleted',
      'user_activated',
      'user_deactivated',
      'password_reset',
      'password_changed',
      'project_created',
      'project_updated',
      'project_deleted',
      'activity_created',
      'activity_updated',
      'activity_deleted',
      'activity_completed',
      'personnel_created',
      'personnel_updated',
      'personnel_deleted',
      'assignment_created',
      'assignment_deleted',
      'material_created',
      'material_updated',
      'material_deleted',
      'bom_created',
      'bom_updated',
      'bom_deleted',
      'config_updated',
      'catalog_updated',
      'unauthorized_access',
      'permission_denied',
      'data_exported',
      'report_generated'
    ])
    .setAllowInvalid(true) // Allow invalid to support new actions
    .setHelpText('Seleccione una acción válida o ingrese una nueva')
    .build();
  accionRange.setDataValidation(accionValidation);
  
  // Add data validation for recurso_tipo column
  const recursoTipoRange = sheet.getRange(2, 5, 1000, 1); // Column E (recurso_tipo)
  const recursoTipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'user',
      'project',
      'activity',
      'personnel',
      'material',
      'bom',
      'assignment',
      'time_entry',
      'system_config',
      'report'
    ])
    .setAllowInvalid(true) // Allow invalid to support new resource types
    .setHelpText('Seleccione un tipo de recurso válido')
    .build();
  recursoTipoRange.setDataValidation(recursoTipoValidation);
  
  // Add sample audit log entries
  const sampleData = [
    [
      'AUD_' + Utilities.getUuid().substring(0, 8),
      'USR_admin001',
      'Administrador Sistema',
      'user_login',
      'user',
      'USR_admin001',
      'Administrador Sistema',
      '{"email": "admin@servesplatform.com"}',
      '192.168.1.100',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      new Date().toISOString(),
      new Date().toISOString(),
      new Date().toISOString()
    ],
    [
      'AUD_' + Utilities.getUuid().substring(0, 8),
      'USR_admin001',
      'Administrador Sistema',
      'user_created',
      'user',
      'USR_editor001',
      'Juan Pérez',
      '{"created_user": {"email": "juan.perez@servesplatform.com", "rol": "editor"}}',
      '192.168.1.100',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      new Date(Date.now() - 3600000).toISOString(),
      new Date(Date.now() - 3600000).toISOString()
    ]
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  // Add conditional formatting for different action types
  // Login actions - green
  const loginRange = sheet.getRange(2, 1, 1000, headers.length);
  const loginRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$D2="user_login"')
    .setBackground('#d4edda')
    .setRanges([loginRange])
    .build();
  
  // Failed actions - red
  const failedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=OR($D2="login_failed",$D2="unauthorized_access",$D2="permission_denied")')
    .setBackground('#f8d7da')
    .setRanges([loginRange])
    .build();
  
  // Create actions - blue
  const createRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=REGEXMATCH($D2,".*_created")')
    .setBackground('#cce5ff')
    .setRanges([loginRange])
    .build();
  
  // Update actions - yellow
  const updateRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=REGEXMATCH($D2,".*_updated")')
    .setBackground('#fff3cd')
    .setRanges([loginRange])
    .build();
  
  // Delete actions - orange
  const deleteRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=REGEXMATCH($D2,".*_deleted")')
    .setBackground('#ffeaa7')
    .setRanges([loginRange])
    .build();
  
  const rules = sheet.getConditionalFormatRules();
  rules.push(loginRule, failedRule, createRule, updateRule, deleteRule);
  sheet.setConditionalFormatRules(rules);
  
  console.log('AuditLog sheet created successfully');
}