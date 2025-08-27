/**
 * Audit Log functionality for ServesPlatform
 * Handles logging of user actions and system events
 */

/**
 * Log an audit event
 */
function logAuditEvent(userId, userName, action, resourceType, resourceId, resourceName, details, ipAddress, userAgent) {
  try {
    const sheet = getSheet('AuditLog');
    
    const auditEntry = {
      id: generateId('AuditLog'),
      usuario_id: userId || 'system',
      usuario_nombre: userName || 'System',
      accion: action,
      recurso_tipo: resourceType,
      recurso_id: resourceId || '',
      recurso_nombre: resourceName || '',
      detalles_json: JSON.stringify(details || {}),
      ip_address: ipAddress || 'unknown',
      user_agent: userAgent || 'unknown',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    insertRecord(sheet, auditEntry);
    return auditEntry;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw error to avoid breaking main operations
    return null;
  }
}

/**
 * Enhanced authentication handler with audit logging
 */
function handleAuthWithAudit(e) {
  try {
    const data = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const { email, password } = data;

    if (!email || !password) {
      // Log failed login attempt
      logAuditEvent(
        'anonymous',
        email || 'unknown',
        'login_failed',
        'user',
        null,
        null,
        { reason: 'missing_credentials', email: email },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Email and password are required', 400);
    }

    // Get user from Usuarios sheet
    const sheet = getSheet('Usuarios');
    const users = getSheetData(sheet);
    
    const user = users.find(u => u.email === email && u.activo === true);
    if (!user) {
      // Log failed login attempt
      logAuditEvent(
        'anonymous',
        email,
        'login_failed',
        'user',
        null,
        null,
        { reason: 'user_not_found', email: email },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Invalid credentials', 401);
    }

    // Verify password (SHA-256 hash)
    const passwordHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password)
      .map(byte => (byte + 256) % 256)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    if (user.password_hash !== passwordHash) {
      // Log failed login attempt
      logAuditEvent(
        user.id,
        user.nombre,
        'login_failed',
        'user',
        user.id,
        user.nombre,
        { reason: 'invalid_password', email: email },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Invalid credentials', 401);
    }

    // Generate JWT
    const jwt = generateJWT({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol
    });

    // Log successful login
    logAuditEvent(
      user.id,
      user.nombre,
      'user_login',
      'user',
      user.id,
      user.nombre,
      { email: email },
      getClientIP(e),
      getUserAgent(e)
    );

    return createSuccessResponse({
      jwt: jwt,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    
    // Log system error
    logAuditEvent(
      'system',
      'System',
      'login_failed',
      'user',
      null,
      null,
      { reason: 'system_error', error: error.message },
      getClientIP(e),
      getUserAgent(e)
    );
    
    return createErrorResponse('Authentication failed', 500);
  }
}

/**
 * Enhanced user creation with audit logging
 */
function handleCreateUserWithAudit(e) {
  try {
    // Validate JWT and check permissions
    const jwt = e.parameter.jwt || (e.postData ? JSON.parse(e.postData.contents).jwt : null);
    const currentUser = validateJWT(jwt);
    
    if (!currentUser) {
      logAuditEvent(
        'anonymous',
        'Unknown',
        'unauthorized_access',
        'user',
        null,
        null,
        { action: 'create_user', reason: 'no_jwt' },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Authentication required', 401);
    }

    // Only admin_lider and admin can create users
    if (currentUser.rol !== 'admin_lider' && currentUser.rol !== 'admin') {
      logAuditEvent(
        currentUser.id,
        currentUser.nombre,
        'permission_denied',
        'user',
        null,
        null,
        { action: 'create_user', user_role: currentUser.rol },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Insufficient permissions to create users', 403);
    }

    const data = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const { email, nombre, rol, password } = data;

    // Validate required fields
    if (!email || !nombre || !rol || !password) {
      return createErrorResponse('Email, nombre, rol, and password are required', 400);
    }

    // Validate role
    const validRoles = ['admin_lider', 'admin', 'editor', 'tecnico'];
    if (!validRoles.includes(rol)) {
      return createErrorResponse('Invalid role. Must be one of: ' + validRoles.join(', '), 400);
    }

    // Check if user already exists
    const sheet = getSheet('Usuarios');
    const users = getSheetData(sheet);
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return createErrorResponse('User with this email already exists', 409);
    }

    // Create user record
    const userRecord = {
      id: generateId('Usuarios'),
      email: email,
      nombre: nombre,
      rol: rol,
      password_hash: hashPassword(password),
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    insertRecord(sheet, userRecord);

    // Log user creation
    logAuditEvent(
      currentUser.id,
      currentUser.nombre,
      'user_created',
      'user',
      userRecord.id,
      userRecord.nombre,
      { 
        created_user: {
          email: userRecord.email,
          nombre: userRecord.nombre,
          rol: userRecord.rol
        }
      },
      getClientIP(e),
      getUserAgent(e)
    );

    // Return user without password hash
    const { password_hash, ...userResponse } = userRecord;
    return createSuccessResponse({
      message: 'User created successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Create user error:', error);
    return createErrorResponse(error.message || 'Failed to create user', 500);
  }
}

/**
 * Enhanced user update with audit logging
 */
function handleUpdateUserWithAudit(e) {
  try {
    // Validate JWT and check permissions
    const jwt = e.parameter.jwt || (e.postData ? JSON.parse(e.postData.contents).jwt : null);
    const currentUser = validateJWT(jwt);
    
    if (!currentUser) {
      return createErrorResponse('Authentication required', 401);
    }

    const data = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const { userId, updates } = data;

    if (!userId) {
      return createErrorResponse('User ID is required', 400);
    }

    // Get existing user
    const sheet = getSheet('Usuarios');
    const users = getSheetData(sheet);
    const existingUser = users.find(u => u.id === userId);
    
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }

    // Permission checks
    const isAdmin = currentUser.rol === 'admin_lider' || currentUser.rol === 'admin';
    const isSelfUpdate = currentUser.id === userId;

    // Only admins can update other users or change roles
    if (!isAdmin && !isSelfUpdate) {
      logAuditEvent(
        currentUser.id,
        currentUser.nombre,
        'permission_denied',
        'user',
        userId,
        existingUser.nombre,
        { action: 'update_user', reason: 'not_admin_or_self' },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Insufficient permissions to update this user', 403);
    }

    // Only admins can change roles
    if (updates.rol && !isAdmin) {
      logAuditEvent(
        currentUser.id,
        currentUser.nombre,
        'permission_denied',
        'user',
        userId,
        existingUser.nombre,
        { action: 'change_role', attempted_role: updates.rol },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Insufficient permissions to change user roles', 403);
    }

    // Store before state for audit
    const beforeState = { ...existingUser };
    delete beforeState.password_hash; // Don't log password hash

    // Validate role if being updated
    if (updates.rol) {
      const validRoles = ['admin_lider', 'admin', 'editor', 'tecnico'];
      if (!validRoles.includes(updates.rol)) {
        return createErrorResponse('Invalid role. Must be one of: ' + validRoles.join(', '), 400);
      }
    }

    // Hash password if being updated
    if (updates.password) {
      updates.password_hash = hashPassword(updates.password);
      delete updates.password; // Remove plain password
    }

    // Update user
    const updatedUser = updateRecord(sheet, userId, updates);

    // Prepare after state for audit
    const afterState = { ...updatedUser };
    delete afterState.password_hash; // Don't log password hash

    // Determine audit action
    let auditAction = 'user_updated';
    if (updates.password_hash) {
      auditAction = isSelfUpdate ? 'password_changed' : 'password_reset';
    }
    if (updates.activo === false) {
      auditAction = 'user_deactivated';
    } else if (updates.activo === true && existingUser.activo === false) {
      auditAction = 'user_activated';
    }

    // Log user update
    logAuditEvent(
      currentUser.id,
      currentUser.nombre,
      auditAction,
      'user',
      userId,
      existingUser.nombre,
      { 
        before: beforeState,
        after: afterState,
        changes: Object.keys(updates)
      },
      getClientIP(e),
      getUserAgent(e)
    );

    // Return user without password hash
    const { password_hash, ...userResponse } = updatedUser;
    return createSuccessResponse({
      message: 'User updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Update user error:', error);
    return createErrorResponse(error.message || 'Failed to update user', 500);
  }
}

/**
 * Get client IP address from request (best effort)
 */
function getClientIP(e) {
  try {
    // Google Apps Script doesn't provide direct access to client IP
    // This is a placeholder for future enhancement
    return 'server-side';
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Get user agent from request (best effort)
 */
function getUserAgent(e) {
  try {
    // Google Apps Script doesn't provide direct access to user agent
    // This is a placeholder for future enhancement
    return 'server-side';
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Enhanced CRUD handler with audit logging
 */
function handleCRUDWithAudit(e) {
  try {
    // Validate JWT for CRUD operations
    const jwt = e.parameter.jwt || (e.postData ? JSON.parse(e.postData.contents).jwt : null);
    const user = validateJWT(jwt);
    
    if (!user) {
      logAuditEvent(
        'anonymous',
        'Unknown',
        'unauthorized_access',
        'unknown',
        null,
        null,
        { action: 'crud_operation', reason: 'no_jwt' },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Authentication required', 401);
    }

    const data = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const { table, operation, id, record, limit, q } = data;

    if (!table || !operation) {
      return createErrorResponse('Table and operation are required', 400);
    }

    // Check permissions
    if (!hasPermission(user, table, operation)) {
      logAuditEvent(
        user.id,
        user.nombre,
        'permission_denied',
        table.toLowerCase(),
        id,
        null,
        { action: operation, table: table, user_role: user.rol },
        getClientIP(e),
        getUserAgent(e)
      );
      
      return createErrorResponse('Insufficient permissions', 403);
    }

    const sheet = getSheet(table);
    let result;
    let auditAction = '';
    let resourceName = '';

    // Get existing record for audit purposes (for update/delete operations)
    let existingRecord = null;
    if ((operation === 'update' || operation === 'delete') && id) {
      const allData = getSheetData(sheet);
      existingRecord = allData.find(r => r.id === id);
      resourceName = getResourceName(existingRecord, table);
    }

    switch (operation) {
      case 'list':
        result = listRecords(sheet, user, limit, q);
        // Don't log list operations to avoid spam
        break;
        
      case 'get':
        if (!id) return createErrorResponse('ID required for get operation', 400);
        result = getRecord(sheet, id, user);
        // Don't log get operations to avoid spam
        break;
        
      case 'create':
        if (!record) return createErrorResponse('Record data required for create operation', 400);
        result = createRecord(sheet, record, user);
        auditAction = getAuditActionForTable(table, 'create');
        resourceName = getResourceName(result, table);
        
        logAuditEvent(
          user.id,
          user.nombre,
          auditAction,
          table.toLowerCase(),
          result.id,
          resourceName,
          { after: result },
          getClientIP(e),
          getUserAgent(e)
        );
        break;
        
      case 'update':
        if (!id || !record) return createErrorResponse('ID and record data required for update operation', 400);
        result = updateRecordWithPermissions(sheet, id, record, user);
        auditAction = getAuditActionForTable(table, 'update');
        resourceName = getResourceName(existingRecord, table);
        
        logAuditEvent(
          user.id,
          user.nombre,
          auditAction,
          table.toLowerCase(),
          id,
          resourceName,
          { 
            before: existingRecord,
            after: result,
            changes: Object.keys(record)
          },
          getClientIP(e),
          getUserAgent(e)
        );
        break;
        
      case 'delete':
        if (!id) return createErrorResponse('ID required for delete operation', 400);
        result = deleteRecordWithPermissions(sheet, id, user);
        auditAction = getAuditActionForTable(table, 'delete');
        resourceName = getResourceName(existingRecord, table);
        
        logAuditEvent(
          user.id,
          user.nombre,
          auditAction,
          table.toLowerCase(),
          id,
          resourceName,
          { before: existingRecord },
          getClientIP(e),
          getUserAgent(e)
        );
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
 * Get audit action name for table and operation
 */
function getAuditActionForTable(table, operation) {
  const tableMap = {
    'Usuarios': 'user',
    'Proyectos': 'project',
    'Actividades': 'activity',
    'Colaboradores': 'personnel',
    'Materiales': 'material',
    'BOM': 'bom',
    'Asignaciones': 'assignment',
    'Horas': 'time_entry'
  };
  
  const tableName = tableMap[table] || table.toLowerCase();
  return `${tableName}_${operation}d`;
}

/**
 * Get resource name for audit logging
 */
function getResourceName(record, table) {
  if (!record) return '';
  
  switch (table) {
    case 'Usuarios':
      return record.nombre || record.email || '';
    case 'Proyectos':
      return record.nombre || record.codigo || '';
    case 'Actividades':
      return record.titulo || record.codigo || '';
    case 'Colaboradores':
      return record.nombres || '';
    case 'Materiales':
      return record.descripcion || record.sku || '';
    case 'Clientes':
      return record.razon_social || record.nombre_comercial || '';
    default:
      return record.nombre || record.titulo || record.descripcion || record.id || '';
  }
}