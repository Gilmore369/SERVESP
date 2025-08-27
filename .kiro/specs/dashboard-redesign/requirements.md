# Requirements Document

## Introduction

El dashboard actual de ServesPlatform es muy básico y no refleja la funcionalidad profesional necesaria para una plataforma de gestión de construcción. Se requiere una reestructuración completa basada en el diseño de referencia (Index.html) para crear una interfaz moderna, funcional y profesional que incluya sidebar de navegación, métricas en tiempo real, gestión de proyectos, tareas pendientes, disponibilidad del equipo y cronograma.

## Requirements

### Requirement 1

**User Story:** Como administrador del sistema, quiero un sidebar de navegación completo y funcional, para poder acceder fácilmente a todas las secciones de la plataforma.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar un sidebar con el logo "ConstructPro" y navegación organizada por secciones
2. WHEN el usuario hace clic en una opción del sidebar THEN el sistema SHALL navegar a la sección correspondiente
3. WHEN el usuario está en dispositivo móvil THEN el sistema SHALL mostrar un sidebar colapsable con overlay
4. WHEN el usuario ve el sidebar THEN el sistema SHALL mostrar información del usuario logueado con avatar y email

### Requirement 2

**User Story:** Como gerente de proyectos, quiero ver métricas clave en tarjetas de resumen, para tener una vista rápida del estado general de la operación.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar 4 tarjetas de métricas: Proyectos Activos, Personal Activo, Tareas Pendientes y Presupuesto Restante
2. WHEN se muestran las métricas THEN el sistema SHALL incluir iconos distintivos y colores para cada tipo de métrica
3. WHEN se muestran las métricas THEN el sistema SHALL incluir indicadores de tendencia (subida/bajada) con texto descriptivo
4. WHEN las métricas se actualizan THEN el sistema SHALL reflejar los datos reales del backend

### Requirement 3

**User Story:** Como supervisor de obra, quiero ver una sección de proyectos recientes con información detallada, para monitorear el progreso de cada proyecto activo.

#### Acceptance Criteria

1. WHEN el usuario ve la sección de proyectos THEN el sistema SHALL mostrar tarjetas de proyectos con nombre, estado, descripción y progreso
2. WHEN se muestra un proyecto THEN el sistema SHALL incluir barra de progreso visual, fechas de inicio/fin y avatares del equipo asignado
3. WHEN el usuario hace clic en "Ver detalles" THEN el sistema SHALL navegar a la página específica del proyecto
4. WHEN se muestran los proyectos THEN el sistema SHALL incluir botón "Nuevo Proyecto" para crear proyectos adicionales

### Requirement 4

**User Story:** Como coordinador de tareas, quiero ver una lista de tareas pendientes organizadas por prioridad, para gestionar eficientemente el trabajo diario.

#### Acceptance Criteria

1. WHEN el usuario ve las tareas pendientes THEN el sistema SHALL mostrar tareas con título, proyecto asociado, prioridad y fecha de vencimiento
2. WHEN se muestra una tarea THEN el sistema SHALL usar códigos de color para indicar prioridad (alta=azul, media=amarillo, baja=verde)
3. WHEN el usuario hace clic en "Completar" THEN el sistema SHALL marcar la tarea como completada
4. WHEN el usuario hace clic en "Agregar Tarea" THEN el sistema SHALL permitir crear nuevas tareas

### Requirement 5

**User Story:** Como gerente de recursos humanos, quiero ver la disponibilidad del equipo en tiempo real, para asignar personal a tareas según su estado actual.

#### Acceptance Criteria

1. WHEN el usuario ve la disponibilidad del equipo THEN el sistema SHALL mostrar lista de personal con foto, nombre, rol y estado actual
2. WHEN se muestra el estado del personal THEN el sistema SHALL usar indicadores de color (verde=disponible, amarillo=ocupado, rojo=no disponible)
3. WHEN se muestra la disponibilidad THEN el sistema SHALL incluir horarios específicos de disponibilidad
4. WHEN el usuario hace clic en "Ver Todo el Personal" THEN el sistema SHALL navegar a la página completa de gestión de personal

### Requirement 6

**User Story:** Como planificador de proyectos, quiero ver un cronograma con eventos importantes, para coordinar actividades y reuniones del equipo.

#### Acceptance Criteria

1. WHEN el usuario ve el cronograma THEN el sistema SHALL mostrar eventos organizados por fecha con navegación mensual
2. WHEN se muestra un evento THEN el sistema SHALL incluir título, proyecto asociado, hora y tipo de actividad con iconos distintivos
3. WHEN el usuario navega entre meses THEN el sistema SHALL actualizar los eventos mostrados según el período seleccionado
4. WHEN se muestran los eventos THEN el sistema SHALL usar iconos específicos para diferentes tipos (reunión, entrega, inspección)
### R
equirement 7

**User Story:** Como usuario del sistema, quiero un header superior con notificaciones y perfil de usuario, para acceder rápidamente a información importante y configuraciones personales.

#### Acceptance Criteria

1. WHEN el usuario ve el header THEN el sistema SHALL mostrar título de la página actual, notificaciones y menú de usuario
2. WHEN hay notificaciones pendientes THEN el sistema SHALL mostrar badges con números en los iconos de notificación y mensajes
3. WHEN el usuario hace clic en notificaciones THEN el sistema SHALL mostrar dropdown con lista de notificaciones recientes
4. WHEN el usuario hace clic en su perfil THEN el sistema SHALL mostrar menú dropdown con opciones de configuración y logout

### Requirement 8

**User Story:** Como usuario en dispositivo móvil, quiero que el dashboard sea completamente responsivo, para poder usar la plataforma desde cualquier dispositivo.

#### Acceptance Criteria

1. WHEN el usuario accede desde dispositivo móvil THEN el sistema SHALL adaptar el layout a pantallas pequeñas
2. WHEN está en móvil THEN el sistema SHALL mostrar botón hamburguesa para abrir/cerrar el sidebar
3. WHEN el sidebar está abierto en móvil THEN el sistema SHALL mostrar overlay oscuro para cerrar el menú
4. WHEN las tarjetas se muestran en móvil THEN el sistema SHALL reorganizar el grid para una sola columna

### Requirement 9

**User Story:** Como desarrollador del sistema, quiero que el dashboard use componentes reutilizables y estilos consistentes, para mantener coherencia visual y facilitar el mantenimiento.

#### Acceptance Criteria

1. WHEN se implementa el dashboard THEN el sistema SHALL usar Tailwind CSS para todos los estilos
2. WHEN se crean componentes THEN el sistema SHALL seguir la estructura de componentes de React/Next.js
3. WHEN se usan iconos THEN el sistema SHALL usar Font Awesome o Heroicons de manera consistente
4. WHEN se implementan animaciones THEN el sistema SHALL usar transiciones CSS suaves para mejorar la experiencia de usuario