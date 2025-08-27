/**
 * Authentication handlers for ServesPlatform
 */

/**
 * Handle authentication requests
 */
function handleAuth(e) {
  try {
    const data = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const { email, password } = data;

    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400);
    }

    // Get user from Usuarios sheet
    const sheet = getSheet('Usuarios');
    const users = getSheetData(sheet);
    
    const user = users.find(u => u.email === email && u.activo === true);
    if (!user) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Verify password (SHA-256 hash)
    const passwordHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password)
      .map(byte => (byte + 256) % 256)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    if (user.password_hash !== passwordHash) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Generate JWT
    const jwt = generateJWT({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol
    });

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
    return createErrorResponse('Authentication failed', 500);
  }
}

/**
 * Handle whoami requests (validate JWT and return user info)
 */
function handleWhoAmI(e) {
  try {
    const jwt = e.parameter.jwt || (e.postData ? JSON.parse(e.postData.contents).jwt : null);
    
    if (!jwt) {
      return createErrorResponse('JWT token required', 401);
    }

    const payload = validateJWT(jwt);
    if (!payload) {
      return createErrorResponse('Invalid or expired token', 401);
    }

    return createSuccessResponse({
      user: payload
    });

  } catch (error) {
    console.error('WhoAmI error:', error);
    return createErrorResponse('Token validation failed', 500);
  }
}

/**
 * Generate JWT token
 */
function generateJWT(payload) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + (24 * 60 * 60) // 24 hours expiration
  };

  const encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header)).replace(/=/g, '');
  const encodedPayload = Utilities.base64EncodeWebSafe(JSON.stringify(jwtPayload)).replace(/=/g, '');
  
  const signature = Utilities.computeHmacSha256Signature(
    encodedHeader + '.' + encodedPayload,
    CONFIG.JWT_SECRET
  );
  const encodedSignature = Utilities.base64EncodeWebSafe(signature).replace(/=/g, '');

  return encodedHeader + '.' + encodedPayload + '.' + encodedSignature;
}

/**
 * Validate JWT token
 */
function validateJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    
    // Verify signature
    const expectedSignature = Utilities.computeHmacSha256Signature(
      encodedHeader + '.' + encodedPayload,
      CONFIG.JWT_SECRET
    );
    const expectedEncodedSignature = Utilities.base64EncodeWebSafe(expectedSignature).replace(/=/g, '');

    if (encodedSignature !== expectedEncodedSignature) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(encodedPayload)).getDataAsString());
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;

  } catch (error) {
    console.error('JWT validation error:', error);
    return null;
  }
}

/**
 * Hash password using SHA-256
 */
function hashPassword(password) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password)
    .map(byte => (byte + 256) % 256)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Handle user creation with password hashing and role validation
 */
function handleCreateUser(e) {
  try {
    // Validate JWT and check permissions
    const jwt = e.parameter.jwt || (e.postData ? JSON.parse(e.postData.contents).jwt : null);
    const currentUser = validateJWT(jwt);
    
    if (!currentUser) {
      return createErrorResponse('Authentication required', 401);
    }

    // Only admin_lider and admin can create users
    if (currentUser.rol !== 'admin_lider' && currentUser.rol !== 'admin') {
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
 * Handle user updates with role validation
 */
function handleUpdateUser(e) {
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
      return createErrorResponse('Insufficient permissions to update this user', 403);
    }

    // Only admins can change roles
    if (updates.rol && !isAdmin) {
      return createErrorResponse('Insufficient permissions to change user roles', 403);
    }

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
 * Handle user deactivation
 */
function handleDeactivateUser(e) {
  try {
    // Validate JWT and check permissions
    const jwt = e.parameter.jwt || (e.postData ? JSON.parse(e.postData.contents).jwt : null);
    const currentUser = validateJWT(jwt);
    
    if (!currentUser) {
      return createErrorResponse('Authentication required', 401);
    }

    // Only admin_lider and admin can deactivate users
    if (currentUser.rol !== 'admin_lider' && currentUser.rol !== 'admin') {
      return createErrorResponse('Insufficient permissions to deactivate users', 403);
    }

    const data = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const { userId } = data;

    if (!userId) {
      return createErrorResponse('User ID is required', 400);
    }

    // Prevent self-deactivation
    if (currentUser.id === userId) {
      return createErrorResponse('Cannot deactivate your own account', 400);
    }

    // Get existing user
    const sheet = getSheet('Usuarios');
    const users = getSheetData(sheet);
    const existingUser = users.find(u => u.id === userId);
    
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }

    // Deactivate user (soft delete)
    const updatedUser = updateRecord(sheet, userId, { activo: false });

    // Return user without password hash
    const { password_hash, ...userResponse } = updatedUser;
    return createSuccessResponse({
      message: 'User deactivated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    return createErrorResponse(error.message || 'Failed to deactivate user', 500);
  }
}