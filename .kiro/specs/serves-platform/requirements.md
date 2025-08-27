# Requirements Document

## Introduction

ServesPlatform es una aplicación web integral para la gestión de operaciones de empresas de servicios generales (eléctrico, civil, CCTV, mantenimiento). La plataforma debe proporcionar un sistema completo de gestión de proyectos, personal, materiales, y reportes con autenticación basada en roles y un backend MVP utilizando Google Sheets como base de datos a través de Google Apps Script.

## Requirements

### Requirement 1: Sistema de Autenticación y Autorización

**User Story:** Como usuario del sistema, quiero poder iniciar sesión con mi email y contraseña para acceder a las funcionalidades según mi rol asignado.

#### Acceptance Criteria

1. WHEN un usuario ingresa credenciales válidas THEN el sistema SHALL generar un JWT con información del usuario y rol
2. WHEN un usuario intenta acceder sin autenticación THEN el sistema SHALL redirigir a la página de login
3. IF el usuario tiene rol admin_lider o admin THEN el sistema SHALL permitir acceso a todas las funcionalidades
4. IF el usuario tiene rol editor THEN el sistema SHALL permitir CRUD dentro de proyectos donde es miembro
5. IF el usuario tiene rol tecnico THEN el sistema SHALL permitir solo lectura y registro de horas/evidencias en sus asignaciones
6. WHEN el JWT expira THEN el sistema SHALL requerir nueva autenticación

### Requirement 2: Dashboard y KPIs

**User Story:** Como usuario autenticado, quiero ver un dashboard con métricas clave y resumen de actividades para tener una visión general del estado operacional.

#### Acceptance Criteria

1. WHEN accedo al dashboard THEN el sistema SHALL mostrar tarjetas KPI con Proyectos Activos, Tareas Pendientes, Personal Activo, y Presupuesto Restante
2. WHEN soy admin_lider o admin THEN el sistema SHALL mostrar datos de todos los proyectos
3. WHEN soy editor o tecnico THEN el sistema SHALL mostrar solo datos de mis proyectos asignados
4. WHEN hay alertas del sistema THEN el dashboard SHALL mostrar timeline de actividades vencidas, faltantes de materiales, y certificaciones por vencer
5. WHEN hay proyectos recientes THEN el sistema SHALL mostrar lista con estado, progreso y próximo hito

### Requirement 3: Gestión de Proyectos

**User Story:** Como gestor de proyectos, quiero crear, editar y gestionar proyectos con sus actividades asociadas para organizar el trabajo de manera estructurada.

#### Acceptance Criteria

1. WHEN creo un proyecto THEN el sistema SHALL requerir codigo, nombre, cliente_id, responsable_id, ubicacion, descripcion, linea_servicio, sla_objetivo, fechas de inicio y fin, presupuesto_total, y moneda
2. WHEN accedo al detalle de un proyecto THEN el sistema SHALL mostrar tabs para Actividades, Materiales & BOM, Personal & Horas, Documentos, Costos & Presupuesto, Riesgos/Calidad, e Historial
3. WHEN gestiono actividades THEN el sistema SHALL permitir vista Kanban por estado y mini Gantt semanal
4. WHEN una actividad cambia a "Completada" THEN el sistema SHALL requerir checklist OK y al menos 1 evidencia
5. WHEN registro cambios en el proyecto THEN el sistema SHALL actualizar el historial de cambios

### Requirement 4: Gestión de Personal y Horas

**User Story:** Como administrador de recursos humanos, quiero gestionar colaboradores y sus asignaciones para optimizar la utilización del personal.

#### Acceptance Criteria

1. WHEN registro un colaborador THEN el sistema SHALL almacenar dni_ruc, nombres, telefono, email, especialidad, tarifa_hora, zona, y certificaciones
2. WHEN asigno personal a actividades THEN el sistema SHALL evitar solapamiento de horarios del mismo colaborador
3. WHEN un colaborador registra horas THEN el sistema SHALL validar que esté asignado a la actividad y proyecto
4. WHEN consulto utilización THEN el sistema SHALL mostrar KPIs de horas planificadas vs ejecutadas por colaborador
5. WHEN una certificación está próxima a vencer THEN el sistema SHALL generar alerta

### Requirement 5: Gestión de Materiales y BOM

**User Story:** Como encargado de materiales, quiero gestionar el inventario y las listas de materiales por proyecto para asegurar disponibilidad y control de costos.

#### Acceptance Criteria

1. WHEN registro un material THEN el sistema SHALL almacenar sku, descripcion, unidad, costo_ref, stock, y minimo
2. WHEN creo BOM para una actividad THEN el sistema SHALL permitir especificar qty_requerida, proveedor_sugerido, costo_unit_est, y lead_time_dias
3. WHEN el stock está por debajo del mínimo THEN el sistema SHALL generar alerta de faltante
4. WHEN actualizo estado de abastecimiento THEN el sistema SHALL reflejar Por pedir/Pedido/Recibido/Entregado
5. WHEN genero solicitud de compra THEN el sistema SHALL crear registro con materiales faltantes

### Requirement 6: Sistema de Reportes

**User Story:** Como gerente operacional, quiero generar reportes de diferentes aspectos del negocio para tomar decisiones informadas.

#### Acceptance Criteria

1. WHEN genero reporte de operaciones THEN el sistema SHALL mostrar cumplimiento de programación, duración promedio, y retrabajos
2. WHEN genero reporte de capacidad THEN el sistema SHALL mostrar utilización de cuadrillas y plan vs ejecutado
3. WHEN genero reporte de compras THEN el sistema SHALL mostrar % urgentes y lead time real vs plan
4. WHEN genero reporte financiero THEN el sistema SHALL calcular margen bruto por proyecto (HH+materiales vs presupuesto)
5. WHEN exporto cualquier reporte THEN el sistema SHALL permitir descarga en formato CSV

### Requirement 7: Administración de Usuarios

**User Story:** Como administrador del sistema, quiero gestionar usuarios y sus permisos para controlar el acceso a la plataforma.

#### Acceptance Criteria

1. WHEN creo un usuario THEN el sistema SHALL requerir email, nombre, rol, y contraseña
2. WHEN asigno roles THEN el sistema SHALL validar que solo admin_lider y admin puedan crear/editar usuarios
3. WHEN reseteo contraseña THEN el sistema SHALL generar hash SHA-256 de la nueva contraseña
4. WHEN desactivo un usuario THEN el sistema SHALL impedir su acceso sin eliminar sus datos históricos
5. WHEN un editor intenta cambiar roles THEN el sistema SHALL denegar la operación

### Requirement 8: Backend con Google Apps Script

**User Story:** Como desarrollador del sistema, quiero un backend funcional usando Google Apps Script que sirva como API REST para todas las operaciones.

#### Acceptance Criteria

1. WHEN se realiza cualquier petición THEN el sistema SHALL validar el API_TOKEN
2. WHEN se autentica un usuario THEN el sistema SHALL verificar password_hash SHA-256 y generar JWT HS256
3. WHEN se realizan operaciones CRUD THEN el sistema SHALL mapear automáticamente encabezados de pestañas de Google Sheets
4. WHEN se crea un registro THEN el sistema SHALL generar ID único con prefijo de tabla y timestamp base36
5. WHEN se actualiza un registro THEN el sistema SHALL establecer updated_at automáticamente
6. WHEN se accede con JWT THEN el sistema SHALL verificar firma y expiración

### Requirement 9: Frontend Responsive con Next.js

**User Story:** Como usuario final, quiero una interfaz web moderna y responsive que funcione en diferentes dispositivos.

#### Acceptance Criteria

1. WHEN accedo desde cualquier dispositivo THEN la interfaz SHALL ser completamente responsive
2. WHEN navego por la aplicación THEN el sistema SHALL mantener sidebar fija con navegación clara
3. WHEN interactúo con formularios THEN el sistema SHALL mostrar validaciones en tiempo real
4. WHEN cargo datos THEN el sistema SHALL mostrar estados de loading apropiados
5. WHEN ocurre un error THEN el sistema SHALL mostrar mensajes de error claros y accionables

### Requirement 10: Configuración y Documentación

**User Story:** Como administrador del sistema, quiero configurar parámetros del sistema y acceder a documentación para mantener la plataforma operativa.

#### Acceptance Criteria

1. WHEN configuro catálogos THEN el sistema SHALL permitir gestionar clientes, materiales, y líneas de servicio
2. WHEN defino plantillas THEN el sistema SHALL permitir crear checklists reutilizables
3. WHEN establezco parámetros THEN el sistema SHALL permitir configurar timezone, moneda, y formatos de códigos
4. WHEN accedo a documentación THEN el sistema SHALL mostrar SOPs en formato Markdown con buscador
5. WHEN consulto expedientes THEN el sistema SHALL mostrar URLs a documentos de Drive organizados por proyecto