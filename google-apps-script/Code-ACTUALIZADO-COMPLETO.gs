/**
 * ServesPlatform Google Apps Script Backend - VERSIÓN ACTUALIZADA COMPLETA
 * COPIA EXACTAMENTE ESTE CÓDIGO A TU GOOGLE APPS SCRIPT
 */

// Configuración
const CONFIG = {
  API_TOKEN: "demo-token-2024",
  ENVIRONMENT: "development"
};

/**
 * Maneja peticiones GET
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Maneja peticiones POST
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Manejador principal de peticiones
 */
function handleRequest(e) {
  try {
    // Inicializar parámetros
    if (!e) e = { parameter: {}, postData: null };
    if (!e.parameter) e.parameter = {};

    let params = e.parameter;
    let postData = null;

    // Si es POST, obtener datos del body
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
        // Combinar parámetros de URL con datos POST
        params = { ...params, ...postData };
      } catch (error) {
        console.log("No se pudo parsear POST data:", error);
      }
    }

    const action = params.action;
    console.log("Action:", action, "Params:", JSON.stringify(params));

    // Rutear según la acción
    switch (action) {
      // Autenticación
      case "login":
        return handleLogin(params);
      
      // Dashboard
      case "getDashboardStats":
        return handleGetDashboardStats();
      
      // Usuarios
      case "getUsuarios":
        return handleGetUsuarios();
      case "createUsuario":
        return handleCreateUsuario(params);
      case "updateUsuario":
        return handleUpdateUsuario(params);
      case "deleteUsuario":
        return handleDeleteUsuario(params);
      
      // Proyectos
      case "getProyectos":
        return handleGetProyectos();
      case "createProyecto":
        return handleCreateProyecto(params);
      
      // Tareas
      case "getTareas":
        return handleGetTareas();
      case "createTarea":
        return handleCreateTarea(params);
      
      // Clientes
      case "getClientes":
        return handleGetClientes();
      case "createCliente":
        return handleCreateCliente(params);
      case "updateCliente":
        return handleUpdateCliente(params);
      case "deleteCliente":
        return handleDeleteCliente(params);
      
      // Materiales
      case "getMateriales":
        return handleGetMateriales();
      case "createMaterial":
        return handleCreateMaterial(params);
      case "updateMaterial":
        return handleUpdateMaterial(params);
      case "deleteMaterial":
        return handleDeleteMaterial(params);
      
      // Líneas de Servicio
      case "getLineasServicio":
        return handleGetLineasServicio();
      case "createLineaServicio":
        return handleCreateLineaServicio(params);
      case "updateLineaServicio":
        return handleUpdateLineaServicio(params);
      case "deleteLineaServicio":
        return handleDeleteLineaServicio(params);
      
      default:
        return createErrorResponse("Acción no válida: " + action, 400);
    }
    
  } catch (error) {
    console.error("Error en handleRequest:", error);
    return createErrorResponse("Error interno: " + error.message, 500);
  }
}

// ============ AUTENTICACIÓN ============

function handleLogin(params) {
  try {
    const { email, password } = params;
    
    console.log("Login attempt:", email);
    
    // Usuarios de prueba
    const testUsers = [
      {
        id: "1",
        email: "admin@servesplatform.com",
        password: "admin123",
        nombre: "Administrador",
        rol: "admin"
      },
      {
        id: "2", 
        email: "tecnico@servesplatform.com",
        password: "tecnico123",
        nombre: "Técnico Principal",
        rol: "tecnico"
      }
    ];
    
    const user = testUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return createSuccessResponse({
        success: true,
        user: userWithoutPassword,
        token: "demo-token-" + Date.now()
      });
    }
    
    return createErrorResponse("Credenciales inválidas", 401);
    
  } catch (error) {
    console.error("Error en login:", error);
    return createErrorResponse("Error de autenticación", 500);
  }
}

// ============ DASHBOARD ============

function handleGetDashboardStats() {
  try {
    // Simular cálculo de estadísticas desde las "tablas"
    const stats = {
      totalProjects: 12,
      activeProjects: 8,
      completedTasks: 156,
      pendingTasks: 23,
      teamMembers: 15,
      efficiency: 87
    };
    
    return createSuccessResponse(stats);
    
  } catch (error) {
    console.error("Error en getDashboardStats:", error);
    return createErrorResponse("Error al obtener estadísticas", 500);
  }
}

// ============ USUARIOS ============

function handleGetUsuarios() {
  try {
    const usuarios = [
      {
        id: "1",
        email: "admin@servesplatform.com",
        nombre: "Administrador",
        rol: "admin",
        activo: true,
        fecha_creacion: "2025-08-27"
      },
      {
        id: "2",
        email: "tecnico@servesplatform.com", 
        nombre: "Técnico Principal",
        rol: "tecnico",
        activo: true,
        fecha_creacion: "2025-08-27"
      }
    ];
    
    return createSuccessResponse(usuarios);
    
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    return createErrorResponse("Error al obtener usuarios", 500);
  }
}

function handleCreateUsuario(params) {
  try {
    const nuevoUsuario = {
      id: Date.now().toString(),
      email: params.email,
      nombre: params.nombre,
      rol: params.rol,
      activo: params.activo !== false,
      fecha_creacion: new Date().toISOString()
    };
    
    console.log("Usuario creado:", JSON.stringify(nuevoUsuario));
    return createSuccessResponse(nuevoUsuario);
    
  } catch (error) {
    console.error("Error en createUsuario:", error);
    return createErrorResponse("Error al crear usuario", 500);
  }
}

function handleUpdateUsuario(params) {
  try {
    const usuarioActualizado = {
      id: params.id,
      email: params.email,
      nombre: params.nombre,
      rol: params.rol,
      activo: params.activo,
      fecha_actualizacion: new Date().toISOString()
    };
    
    return createSuccessResponse(usuarioActualizado);
    
  } catch (error) {
    console.error("Error en updateUsuario:", error);
    return createErrorResponse("Error al actualizar usuario", 500);
  }
}

function handleDeleteUsuario(params) {
  try {
    return createSuccessResponse({ 
      id: params.id, 
      message: "Usuario eliminado correctamente" 
    });
    
  } catch (error) {
    console.error("Error en deleteUsuario:", error);
    return createErrorResponse("Error al eliminar usuario", 500);
  }
}

// ============ PROYECTOS ============

function handleGetProyectos() {
  try {
    const proyectos = [
      {
        id: "1",
        nombre: "Construcción Edificio Central",
        cliente: "Inmobiliaria ABC",
        avance_pct: 75,
        estado: "En progreso",
        fecha_fin: "2024-12-15",
        fecha_creacion: "2024-08-01"
      },
      {
        id: "2",
        nombre: "Remodelación Oficinas",
        cliente: "Empresa XYZ", 
        avance_pct: 45,
        estado: "En progreso",
        fecha_fin: "2024-11-30",
        fecha_creacion: "2024-08-15"
      },
      {
        id: "3",
        nombre: "Instalación Eléctrica",
        cliente: "Corporación DEF",
        avance_pct: 90,
        estado: "En progreso", 
        fecha_fin: "2024-10-20",
        fecha_creacion: "2024-07-20"
      }
    ];
    
    return createSuccessResponse(proyectos);
    
  } catch (error) {
    console.error("Error en getProyectos:", error);
    return createErrorResponse("Error al obtener proyectos", 500);
  }
}

function handleCreateProyecto(params) {
  try {
    const nuevoProyecto = {
      id: Date.now().toString(),
      nombre: params.nombre,
      cliente: params.cliente,
      avance_pct: 0,
      estado: "Planificación",
      fecha_fin: params.fecha_fin,
      fecha_creacion: new Date().toISOString()
    };
    
    return createSuccessResponse(nuevoProyecto);
    
  } catch (error) {
    console.error("Error en createProyecto:", error);
    return createErrorResponse("Error al crear proyecto", 500);
  }
}

// ============ TAREAS ============

function handleGetTareas() {
  try {
    const tareas = [
      {
        id: "1",
        titulo: "Revisión de planos estructurales",
        proyecto: "Edificio Central",
        prioridad: "Alta",
        fecha_vencimiento: "2024-09-15",
        estado: "Pendiente"
      },
      {
        id: "2",
        titulo: "Inspección de materiales",
        proyecto: "Oficinas XYZ",
        prioridad: "Media", 
        fecha_vencimiento: "2024-09-18",
        estado: "En progreso"
      },
      {
        id: "3",
        titulo: "Coordinación con proveedores",
        proyecto: "Instalación Eléctrica",
        prioridad: "Alta",
        fecha_vencimiento: "2024-09-12",
        estado: "Pendiente"
      }
    ];
    
    return createSuccessResponse(tareas);
    
  } catch (error) {
    console.error("Error en getTareas:", error);
    return createErrorResponse("Error al obtener tareas", 500);
  }
}

function handleCreateTarea(params) {
  try {
    const nuevaTarea = {
      id: Date.now().toString(),
      titulo: params.titulo,
      proyecto: params.proyecto,
      prioridad: params.prioridad || "Media",
      fecha_vencimiento: params.fecha_vencimiento,
      estado: "Pendiente",
      fecha_creacion: new Date().toISOString()
    };
    
    return createSuccessResponse(nuevaTarea);
    
  } catch (error) {
    console.error("Error en createTarea:", error);
    return createErrorResponse("Error al crear tarea", 500);
  }
}

// ============ CLIENTES ============

function handleGetClientes() {
  try {
    const clientes = [
      {
        id: "1",
        nombre: "Inmobiliaria ABC",
        contacto: "Juan Pérez",
        email: "juan@inmobiliariaabc.com",
        telefono: "+51 999 888 777",
        activo: true
      },
      {
        id: "2", 
        nombre: "Empresa XYZ",
        contacto: "María García",
        email: "maria@empresaxyz.com",
        telefono: "+51 888 777 666",
        activo: true
      }
    ];
    
    return createSuccessResponse(clientes);
    
  } catch (error) {
    console.error("Error en getClientes:", error);
    return createErrorResponse("Error al obtener clientes", 500);
  }
}

function handleCreateCliente(params) {
  try {
    const nuevoCliente = {
      id: Date.now().toString(),
      nombre: params.nombre,
      contacto: params.contacto,
      email: params.email,
      telefono: params.telefono,
      activo: true,
      fecha_creacion: new Date().toISOString()
    };
    
    return createSuccessResponse(nuevoCliente);
    
  } catch (error) {
    console.error("Error en createCliente:", error);
    return createErrorResponse("Error al crear cliente", 500);
  }
}

function handleUpdateCliente(params) {
  try {
    const clienteActualizado = {
      id: params.id,
      nombre: params.nombre,
      contacto: params.contacto,
      email: params.email,
      telefono: params.telefono,
      activo: params.activo,
      fecha_actualizacion: new Date().toISOString()
    };
    
    return createSuccessResponse(clienteActualizado);
    
  } catch (error) {
    console.error("Error en updateCliente:", error);
    return createErrorResponse("Error al actualizar cliente", 500);
  }
}

function handleDeleteCliente(params) {
  try {
    return createSuccessResponse({ 
      id: params.id, 
      message: "Cliente eliminado correctamente" 
    });
    
  } catch (error) {
    console.error("Error en deleteCliente:", error);
    return createErrorResponse("Error al eliminar cliente", 500);
  }
}

// ============ MATERIALES ============

function handleGetMateriales() {
  try {
    const materiales = [
      {
        id: "1",
        sku: "MAT001",
        descripcion: "Cemento Portland Tipo I",
        categoria: "Construcción",
        unidad: "Bolsa",
        costo_ref: 25.50,
        stock_actual: 100,
        stock_minimo: 20,
        proveedor_principal: "Cementos Lima",
        activo: true
      },
      {
        id: "2",
        sku: "MAT002", 
        descripcion: "Fierro de Construcción 1/2\"",
        categoria: "Construcción",
        unidad: "Varilla",
        costo_ref: 35.00,
        stock_actual: 50,
        stock_minimo: 10,
        proveedor_principal: "Aceros Arequipa",
        activo: true
      },
      {
        id: "3",
        sku: "MAT003",
        descripcion: "Ladrillo King Kong 18 huecos",
        categoria: "Construcción", 
        unidad: "Unidad",
        costo_ref: 0.85,
        stock_actual: 5,
        stock_minimo: 100,
        proveedor_principal: "Ladrillera Norte",
        activo: true
      }
    ];
    
    return createSuccessResponse(materiales);
    
  } catch (error) {
    console.error("Error en getMateriales:", error);
    return createErrorResponse("Error al obtener materiales", 500);
  }
}

function handleCreateMaterial(params) {
  try {
    const nuevoMaterial = {
      id: Date.now().toString(),
      sku: params.sku,
      descripcion: params.descripcion,
      categoria: params.categoria,
      unidad: params.unidad,
      costo_ref: parseFloat(params.costo_ref) || 0,
      stock_actual: parseInt(params.stock_actual) || 0,
      stock_minimo: parseInt(params.stock_minimo) || 0,
      proveedor_principal: params.proveedor_principal,
      activo: true,
      fecha_creacion: new Date().toISOString()
    };
    
    return createSuccessResponse(nuevoMaterial);
    
  } catch (error) {
    console.error("Error en createMaterial:", error);
    return createErrorResponse("Error al crear material", 500);
  }
}

function handleUpdateMaterial(params) {
  try {
    const materialActualizado = {
      id: params.id,
      sku: params.sku,
      descripcion: params.descripcion,
      categoria: params.categoria,
      unidad: params.unidad,
      costo_ref: parseFloat(params.costo_ref),
      stock_actual: parseInt(params.stock_actual),
      stock_minimo: parseInt(params.stock_minimo),
      proveedor_principal: params.proveedor_principal,
      activo: params.activo,
      fecha_actualizacion: new Date().toISOString()
    };
    
    return createSuccessResponse(materialActualizado);
    
  } catch (error) {
    console.error("Error en updateMaterial:", error);
    return createErrorResponse("Error al actualizar material", 500);
  }
}

function handleDeleteMaterial(params) {
  try {
    return createSuccessResponse({ 
      id: params.id, 
      message: "Material eliminado correctamente" 
    });
    
  } catch (error) {
    console.error("Error en deleteMaterial:", error);
    return createErrorResponse("Error al eliminar material", 500);
  }
}

// ============ LÍNEAS DE SERVICIO ============

function handleGetLineasServicio() {
  try {
    const lineasServicio = [
      {
        id: "1",
        codigo: "ELEC",
        nombre: "Servicios Eléctricos",
        categoria: "Eléctrico",
        descripcion: "Instalación y mantenimiento eléctrico",
        activo: true
      },
      {
        id: "2",
        codigo: "PLOM",
        nombre: "Servicios de Plomería", 
        categoria: "Plomería",
        descripcion: "Instalación y reparación de sistemas de agua",
        activo: true
      },
      {
        id: "3",
        codigo: "CONS",
        nombre: "Construcción General",
        categoria: "Construcción",
        descripcion: "Servicios generales de construcción",
        activo: true
      }
    ];
    
    return createSuccessResponse(lineasServicio);
    
  } catch (error) {
    console.error("Error en getLineasServicio:", error);
    return createErrorResponse("Error al obtener líneas de servicio", 500);
  }
}

function handleCreateLineaServicio(params) {
  try {
    const nuevaLinea = {
      id: Date.now().toString(),
      codigo: params.codigo,
      nombre: params.nombre,
      categoria: params.categoria,
      descripcion: params.descripcion,
      activo: params.activo !== false,
      fecha_creacion: new Date().toISOString()
    };
    
    return createSuccessResponse(nuevaLinea);
    
  } catch (error) {
    console.error("Error en createLineaServicio:", error);
    return createErrorResponse("Error al crear línea de servicio", 500);
  }
}

function handleUpdateLineaServicio(params) {
  try {
    const lineaActualizada = {
      id: params.id,
      codigo: params.codigo,
      nombre: params.nombre,
      categoria: params.categoria,
      descripcion: params.descripcion,
      activo: params.activo,
      fecha_actualizacion: new Date().toISOString()
    };
    
    return createSuccessResponse(lineaActualizada);
    
  } catch (error) {
    console.error("Error en updateLineaServicio:", error);
    return createErrorResponse("Error al actualizar línea de servicio", 500);
  }
}

function handleDeleteLineaServicio(params) {
  try {
    return createSuccessResponse({ 
      id: params.id, 
      message: "Línea de servicio eliminada correctamente" 
    });
    
  } catch (error) {
    console.error("Error en deleteLineaServicio:", error);
    return createErrorResponse("Error al eliminar línea de servicio", 500);
  }
}

// ============ UTILIDADES ============

function createSuccessResponse(data) {
  const response = {
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message, status) {
  const response = {
    success: false,
    error: message,
    status: status || 400,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función de prueba
 */
function testFunction() {
  console.log("Google Apps Script funcionando correctamente");
  return "OK";
}