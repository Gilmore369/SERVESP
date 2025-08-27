# Implementation Plan

- [x] 1. Setup project structure and configuration

  - Create Next.js 14 project with TypeScript and Tailwind CSS
  - Configure environment variables and project settings
  - Setup Google Apps Script project with proper configuration
  - _Requirements: 8.4, 9.1_

- [x] 2. Implement Google Apps Script backend API

  - [x] 2.1 Create core API infrastructure

    - Implement doGet/doPost handlers with CORS support
    - Create API token validation middleware
    - Setup error handling and response formatting
    - _Requirements: 8.1, 8.2_

  - [x] 2.2 Implement authentication system

    - Create user authentication with SHA-256 password hashing
    - Implement JWT generation and validation (HS256)
    - Create whoami endpoint for user session validation
    - _Requirements: 1.1, 1.6, 8.2, 8.5_

  - [x] 2.3 Implement CRUD operations

    - Create generic CRUD handlers for all tables
    - Implement automatic ID generation with table prefixes
    - Add automatic timestamp management (created_at, updated_at)
    - _Requirements: 8.3, 8.4, 8.5_

  - [x] 2.4 Create user management endpoints

    - Implement createUser endpoint with password hashing
    - Add role-based access control validation
    - Create user activation/deactivation functionality
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 3. Setup Google Sheets database structure

  - [x] 3.1 Create main spreadsheet with all required sheets

    - Create ServesPlatform_DB spreadsheet
    - Setup Usuarios sheet with proper headers and validation
    - Setup Clientes sheet with company information structure
    - _Requirements: 8.3_

  - [x] 3.2 Create project and activity management sheets

    - Setup Proyectos sheet with project lifecycle fields
    - Setup Actividades sheet with WBS structure
    - Add data validation for status and priority fields
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 3.3 Create personnel and time tracking sheets

    - Setup Colaboradores sheet with skills and certification tracking
    - Setup Asignaciones sheet for project assignments
    - Setup Horas sheet for time tracking
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.4 Create materials and BOM management sheets

    - Setup Materiales sheet with inventory tracking
    - Setup BOM sheet for bill of materials per activity
    - Add stock level validation and alerts
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 4. Implement frontend core infrastructure

  - [x] 4.1 Create authentication system

    - Implement login page with form validation
    - Create JWT storage and management utilities
    - Implement route protection middleware
    - _Requirements: 1.1, 1.2, 9.4_

  - [x] 4.2 Create layout and navigation components

    - Implement responsive Sidebar with role-based menu filtering
    - Create Topbar with search functionality and user menu
    - Add mobile-responsive navigation with overlay
    - _Requirements: 9.2, 9.3_

  - [x] 4.3 Setup API client and data fetching

    - Create centralized API client with token management

    - Implement error handling and loading states
    - Setup data fetching hooks with SWR or React Query
    - _Requirements: 9.4, 9.5_

  - [x] 4.4 Create reusable UI components

    - Implement CardKpi component for dashboard metrics
    - Create Table component with filtering and pagination
    - Build Modal and ConfirmDialog components
    - Create Badge component for status display
    - _Requirements: 9.3, 9.4_

- [x] 5. Implement dashboard functionality

  - [x] 5.1 Create main dashboard page

    - Build KPI cards showing key metrics
    - Implement role-based data filtering for dashboard
    - Add recent projects display with progress indicators
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 5.2 Implement alerts and notifications system

    - Create alerts timeline for overdue activities
    - Add material shortage notifications
    - Implement certification expiry warnings
    - _Requirements: 2.4, 4.5, 5.4_

- [-] 6. Implement project management module

  - [x] 6.1 Create project list and search functionality

    - Build projects listing page with filters
    - Implement search by client, status, and responsible
    - Add project creation form with validation
    - _Requirements: 3.1, 3.2_

  - [x] 6.2 Implement project detail view with tabs

    - Create project detail page with tabbed interface
    - Build activities tab with Kanban board view
    - Add mini Gantt chart for weekly planning
    - _Requirements: 3.2, 3.3_

  - [x] 6.3 Create activity management system

    - Implement activity CRUD operations
    - Add checklist requirement for completion
    - Create evidence upload functionality (URL-based)
    - _Requirements: 3.3, 3.4_

- - [x] 6.4 Implement materials and BOM for projects

    - Create materials tab in project detail
    - Implement BOM management per activity
    - Add purchase request generation
    - _Requirements: 5.1, 5.2, 5.5_

-

- [x] 7. Implement personnel management module

  - [x] 7.1 Create personnel master data management

    - Build collaborators listing with search by specialty/zone
    - Implement personnel detail view with certifications
    - Add certification expiry tracking and alerts
    - _Requirements: 4.1, 4.5_

  - [x] 7.2 Implement assignment and scheduling system

    - Create assignment management to prevent overlaps
    - Build daily timesheet entry interface
    - Add utilization reporting and KPIs
    - _Requirements: 4.2, 4.3, 4.4_

- [x] 8. Implement materials and inventory module

  - [x] 8.1 Create materials master data management

    - Build materials catalog with search functionality
    - Implement stock level monitoring
    - Add minimum stock alerts and reorder points
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 8.2 Implement BOM and procurement management

    - Create BOM management interface per activity
    - Implement procurement status tracking
    - Add lead time monitoring and alerts
    - _Requirements: 5.2, 5.5_

- [x] 9. Implement reporting module

  - [x] 9.1 Create operational reports

    - Build schedule compliance reporting
    - Implement average duration and rework tracking
    - Add project performance metrics

  - _Requirements: 6.1_

  - [x] 9.2 Create capacity and financial reports

    - Implement crew utilization reporting
    - Build plan vs actual analysis
    - Create basic project profitability reports
    - _Requirements: 6.2, 6.4_

  - [x] 9.3 Implement export functionality

    - Create CSV export component for all reports
    - Add data formatting and filtering for exports
    - Implement download functionality
    - _Requirements: 6.5_

- [x] 10. Implement administration module

  - [x] 10.1 Create user management interface

    - Build user CRUD interface for admins
    - Implement password reset functionality
    - Add role assignment with validation
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [x] 10.2 Create system configuration

    - Implement catalog management (clients, materials, service lines)
    - Create checklist template management
    - Add system parameters configuration
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 11. Implement documentation module

  - [x] 11.1 Create documentation system

    - Build SOP documentation with Markdown support
    - Implement document search functionality
    - Create project document management with URLs
    - _Requirements: 10.4, 10.5_

- [x] 12. Add role-based permissions and validation

  - [x] 12.1 Implement frontend permission system

    - Create permission checking utilities
    - Add role-based component rendering
    - Implement route-level access control
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 12.2 Add business rule validation

    - Prevent activity completion without checklist and evidence
    - Implement assignment overlap prevention
    - Add role-based operation restrictions
    - _Requirements: 3.4, 4.2, 7.5_

- [x] 13. Create seed data and testing utilities

  - [x] 13.1 Create demo users and authentication data

        - Generate demo users with hashed passwords
        - Create sample client data
        - Setup initial system con

    figuration - _Requirements: 1.1, 7.1_

  - [x] 13.2 Create sample project and operational data

    - Generate demo projects with activities
    - Create sample personnel with assignments
    - Add sample materials and BOM data
    - Generate sample time entries
    - _Requirements: 3.1, 4.1, 5.1_

- [x] 14. Implement responsive design and accessibility

  - [x] 14.1 Ensure mobile responsiveness

    - Test and fix mobile layout issues
    - Implement touch-friendly interactions
    - Add mobile-specific navigation patterns
    - _Requirements: 9.1, 9.2_

  - [x] 14.2 Add accessibility features

    - Implement proper ARIA labels and roles
    - Add keyboard navigation support
    - Ensure color contrast compliance
    - _Requirements: 9.5_

- [x] 15. Setup deployment and documentation

  - [x] 15.1 Prepare Google Apps Script deployment

    - Create deployment documentation with step-by-step instructions
    - Generate curl examples for API testing
    - Setup environment variables and security configuration
    - _Requirements: 8.1_

  - [x] 15.2 Prepare Next.js deployment configuration

    - Create Vercel deployment configuration
    - Setup environment variables for production
    - Create README with setup and deployment instructions
    - _Requirements: 9.1_

  - [x] 15.3 Create comprehensive documentation
    - Write user manual for each module
    - Create administrator guide
    - Document API endpoints and usage
    - _Requirements: 10.4_

## NUEVA FASE: ADAPTACIÓN Y MEJORA DEL DASHBOARD

- [x] 16. Refactorizar y mejorar el Dashboard actual

  - [x] 16.1 Crear componentes reutilizables del Dashboard

    - Extraer CardKpi como componente independiente con props tipadas
    - Crear componente ProjectCard reutilizable con estados dinámicos
    - Implementar componente TaskItem con acciones y prioridades
    - Crear componente AlertsTimeline para notificaciones del sistema
    - _Requirements: 2.1, 2.2, 9.3_

  - [x] 16.2 Implementar conexión real con API del backend

    - Conectar KPIs del dashboard con datos reales de Google Sheets
    - Implementar carga dinámica de proyectos recientes con filtros por rol
    - Conectar tareas pendientes con datos reales de actividades
    - Agregar manejo de estados de loading y error en el dashboard
    - _Requirements: 2.1, 2.2, 2.3, 8.3, 9.4_

  - [x] 16.3 Mejorar la navegación y layout responsivo
    - Refactorizar Sidebar como componente independiente con navegación dinámica
    - Implementar Topbar con funcionalidades de búsqueda y notificaciones
    - Mejorar responsive design para tablets y móviles
    - Agregar breadcrumbs y navegación contextual
    - _Requirements: 9.1, 9.2, 9.3_

- [-] 17. Implementar módulos funcionales completos

  - [x] 17.1 Completar módulo de Proyectos

    - Crear página de listado de proyectos con filtros avanzados
    - Implementar formulario de creación/edición de proyectos
    - Desarrollar vista detallada de proyecto con tabs funcionales
    - Integrar Kanban board para gestión de actividades
    - Agregar mini Gantt chart para planificación semanal
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 17.2 Completar módulo de Personal

    - Crear página de gestión de colaboradores con búsqueda por especialidad
    - Implementar sistema de asignaciones con prevención de solapamientos
    - Desarrollar interfaz de registro de horas por colaborador
    - Crear reportes de utilización y KPIs de personal
    - Agregar alertas de certificaciones próximas a vencer
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 17.3 Completar módulo de Materiales

    - Crear catálogo de materiales con gestión de stock
    - Implementar sistema de BOM (Bill of Materials) por actividad
    - Desarrollar alertas de stock mínimo y faltantes
    - Crear sistema de solicitudes de compra
    - Integrar seguimiento de lead times y proveedores
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 17.4 Completar módulo de Reportes
    - Implementar reportes operacionales con métricas de cumplimiento
    - Crear reportes de capacidad y utilización de recursos
    - Desarrollar reportes financieros básicos por proyecto
    - Agregar funcionalidad de exportación a CSV
    - Implementar filtros avanzados y rangos de fechas
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [-] 18. Implementar funcionalidades administrativas

  - [x] 18.1 Completar gestión de usuarios

    - Crear interfaz CRUD para administración de usuarios
    - Implementar sistema de roles y permisos granulares
    - Desarrollar funcionalidad de reseteo de contraseñas
    - Agregar activación/desactivación de usuarios
    - Implementar auditoría de acciones de usuarios
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 18.2 Implementar configuración del sistema

    - Crear gestión de catálogos (clientes, líneas de servicio)
    - Implementar plantillas de checklists reutilizables
    - Desarrollar configuración de parámetros del sistema
    - Agregar gestión de códigos y formatos automáticos
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 18.3 Completar sistema de documentación
    - Implementar visor de documentación con Markdown
    - Crear sistema de búsqueda en documentos
    - Desarrollar gestión de SOPs por módulo
    - Integrar enlaces a documentos de Google Drive
    - _Requirements: 10.4, 10.5_

- [-] 19. Optimizar rendimiento y experiencia de usuario

  - [x] 19.1 Implementar optimizaciones de rendimiento

    - Agregar lazy loading para componentes pesados
    - Implementar paginación en listados largos
    - Optimizar consultas al backend con caching inteligente
    - Agregar debouncing en búsquedas y filtros
    - _Requirements: 9.4, 9.5_

  - [x] 19.2 Mejorar accesibilidad y usabilidad

    - Implementar navegación por teclado completa
    - Agregar etiquetas ARIA y roles semánticos
    - Mejorar contraste de colores y legibilidad
    - Implementar tooltips y ayuda contextual
    - _Requirements: 9.5_

  - [ ] 19.3 Agregar funcionalidades avanzadas del dashboard
    - Implementar widgets configurables por usuario
    - Agregar gráficos interactivos con Chart.js o similar
    - Crear sistema de notificaciones en tiempo real
    - Implementar shortcuts de teclado para acciones frecuentes
    - _Requirements: 2.4, 9.3_

- [x] 20. Testing y validación integral

  - [x] 20.1 Implementar testing automatizado

    - Crear tests unitarios para componentes críticos
    - Implementar tests de integración para flujos principales
    - Agregar tests E2E para casos de uso completos
    - Crear tests de accesibilidad automatizados
    - _Requirements: 9.5_

  - [x] 20.2 Validar integración completa

    - Probar todos los módulos con datos reales
    - Validar permisos y roles en todos los flujos
    - Verificar responsive design en diferentes dispositivos
    - Probar rendimiento con volúmenes de datos reales
    - _Requirements: 1.3, 1.4, 1.5, 9.1, 9.2_

  - [x] 20.3 Preparar para producción
    - Optimizar bundle de producción
    - Configurar monitoreo de errores
    - Implementar logging estructurado
    - Crear documentación de deployment actualizada
    - _Requirements: 8.1, 9.1_
