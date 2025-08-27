/**
 * CRUD operations handler
 */

/**
 * Handle CRUD operations
 */
function handleCRUD(e) {
  try {
    // Validate JWT for CRUD operations
    const jwt = e.parameter.jwt || (e.postData ? JSON.parse(e.postData.contents).jwt : null);
    const user = validateJWT(jwt);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }

    const data = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const { table, operation, id, record, limit, q } = data;

    if (!table || !operation) {
      return createErrorResponse('Table and operation are required', 400);
    }

    // Check permissions
    if (!hasPermission(user, table, operation)) {
      return createErrorResponse('Insufficient permissions', 403);
    }

    const sheet = getSheet(table);
    let result;

    switch (operation) {
      case 'list':
        result = listRecords(sheet, user, limit, q);
        break;
      case 'get':
        if (!id) return createErrorResponse('ID required for get operation', 400);
        result = getRecord(sheet, id, user);
        break;
      case 'create':
        if (!record) return createErrorResponse('Record data required for create operation', 400);
        result = createRecord(sheet, record, user);
        break;
      case 'update':
        if (!id || !record) return createErrorResponse('ID and record data required for update operation', 400);
        result = updateRecordWithPermissions(sheet, id, record, user);
        break;
      case 'delete':
        if (!id) return createErrorResponse('ID required for delete operation', 400);
        result = deleteRecordWithPermissions(sheet, id, user);
        break;
      default:
        return createErrorResponse('Invalid operation', 400);
    }

    return createSuccessResponse(result);

  } catch (error) {
    console.error('CRUD error:', error);
    return createErrorResponse(error.message || 'CRUD operation failed', 500);
  }
}

/**
 * List records with filtering and permissions
 */
function listRecords(sheet, user, limit = 100, query = '') {
  let data = getSheetData(sheet);
  
  // Apply role-based filtering
  data = applyRoleBasedFilter(data, user, sheet.getName());
  
  // Apply search query if provided
  if (query) {
    data = data.filter(record => 
      Object.values(record).some(value => 
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  }
  
  // Apply limit
  if (limit && limit > 0) {
    data = data.slice(0, limit);
  }
  
  return data;
}

/**
 * Get single record with permissions
 */
function getRecord(sheet, id, user) {
  const data = getSheetData(sheet);
  const record = data.find(r => r.id === id);
  
  if (!record) {
    throw new Error('Record not found');
  }
  
  // Check if user can access this specific record
  if (!canAccessRecord(record, user, sheet.getName())) {
    throw new Error('Access denied to this record');
  }
  
  return record;
}

/**
 * Create record with automatic ID and timestamps
 */
function createRecord(sheet, record, user) {
  // Generate ID and add timestamps
  record.id = generateId(sheet.getName());
  addTimestamps(record, false);
  
  // Add creator information if applicable
  if (sheet.getName() === 'Proyectos' && !record.responsable_id) {
    record.responsable_id = user.id;
  }
  
  return insertRecord(sheet, record);
}

/**
 * Update record with permissions check
 */
function updateRecordWithPermissions(sheet, id, updates, user) {
  const existingRecord = getRecord(sheet, id, user);
  
  if (!canModifyRecord(existingRecord, user, sheet.getName())) {
    throw new Error('Permission denied to modify this record');
  }
  
  return updateRecord(sheet, id, updates);
}

/**
 * Delete record with permissions check
 */
function deleteRecordWithPermissions(sheet, id, user) {
  const existingRecord = getRecord(sheet, id, user);
  
  if (!canModifyRecord(existingRecord, user, sheet.getName())) {
    throw new Error('Permission denied to delete this record');
  }
  
  return deleteRecord(sheet, id);
}

/**
 * Check if user has permission for operation
 */
function hasPermission(user, table, operation) {
  const { rol } = user;
  
  // Admin roles have full access
  if (rol === 'admin_lider' || rol === 'admin') {
    return true;
  }
  
  // Editor role permissions
  if (rol === 'editor') {
    // Can read all, but modify only assigned projects
    if (operation === 'list' || operation === 'get') {
      return true;
    }
    return ['Proyectos', 'Actividades', 'Horas', 'BOM'].includes(table);
  }
  
  // Tecnico role permissions
  if (rol === 'tecnico') {
    // Read-only access plus time entry
    if (operation === 'list' || operation === 'get') {
      return true;
    }
    return table === 'Horas';
  }
  
  return false;
}

/**
 * Apply role-based filtering to data
 */
function applyRoleBasedFilter(data, user, tableName) {
  const { rol, id: userId } = user;
  
  // Admin roles see everything
  if (rol === 'admin_lider' || rol === 'admin') {
    return data;
  }
  
  // Filter based on role and table
  switch (tableName) {
    case 'Proyectos':
      if (rol === 'editor' || rol === 'tecnico') {
        // Show only projects where user is responsible or assigned
        return data.filter(project => 
          project.responsable_id === userId || 
          isUserAssignedToProject(userId, project.id)
        );
      }
      break;
      
    case 'Actividades':
      if (rol === 'editor' || rol === 'tecnico') {
        // Show only activities from accessible projects
        const accessibleProjects = applyRoleBasedFilter(
          getSheetData(getSheet('Proyectos')), 
          user, 
          'Proyectos'
        ).map(p => p.id);
        
        return data.filter(activity => 
          accessibleProjects.includes(activity.proyecto_id)
        );
      }
      break;
      
    case 'Horas':
      if (rol === 'tecnico') {
        // Technicians see only their own hours
        return data.filter(hour => hour.colaborador_id === userId);
      }
      break;
  }
  
  return data;
}

/**
 * Check if user can access specific record
 */
function canAccessRecord(record, user, tableName) {
  // Apply same filtering logic as list
  const filtered = applyRoleBasedFilter([record], user, tableName);
  return filtered.length > 0;
}

/**
 * Check if user can modify specific record
 */
function canModifyRecord(record, user, tableName) {
  const { rol, id: userId } = user;
  
  // Admin roles can modify everything
  if (rol === 'admin_lider' || rol === 'admin') {
    return true;
  }
  
  // Editor role can modify assigned projects and their activities
  if (rol === 'editor') {
    if (tableName === 'Proyectos') {
      return record.responsable_id === userId;
    }
    if (tableName === 'Actividades') {
      // Check if user is responsible for the project
      const project = getSheetData(getSheet('Proyectos'))
        .find(p => p.id === record.proyecto_id);
      return project && project.responsable_id === userId;
    }
  }
  
  // Tecnico role can only modify their own hours
  if (rol === 'tecnico' && tableName === 'Horas') {
    return record.colaborador_id === userId;
  }
  
  return false;
}

/**
 * Check if user is assigned to project (helper function)
 */
function isUserAssignedToProject(userId, projectId) {
  try {
    const assignments = getSheetData(getSheet('Asignaciones'));
    return assignments.some(assignment => 
      assignment.colaborador_id === userId && 
      assignment.proyecto_id === projectId
    );
  } catch (error) {
    return false;
  }
}