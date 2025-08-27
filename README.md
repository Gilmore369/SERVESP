# ServesPlatform

ServesPlatform es una aplicación web integral para la gestión de operaciones de empresas de servicios generales (eléctrico, civil, CCTV, mantenimiento). La plataforma proporciona un sistema completo de gestión de proyectos, personal, materiales, y reportes con autenticación basada en roles.

## Características Principales

- **Gestión de Proyectos**: Creación, seguimiento y gestión completa de proyectos
- **Gestión de Personal**: Administración de colaboradores, asignaciones y registro de horas
- **Gestión de Materiales**: Control de inventario y listas de materiales (BOM)
- **Sistema de Reportes**: Reportes operacionales, de capacidad y financieros
- **Autenticación por Roles**: Control de acceso basado en roles (Admin, Editor, Técnico)
- **Dashboard Interactivo**: KPIs y métricas en tiempo real

## Arquitectura Técnica

### Frontend
- **Next.js 14** con App Router
- **React 19** con TypeScript
- **Tailwind CSS** para estilos
- **Responsive Design** para móviles y desktop

### Backend
- **Google Apps Script** como API REST
- **Google Sheets** como base de datos MVP
- **JWT Authentication** con roles
- **CORS** habilitado para acceso web

## Estructura del Proyecto

```
├── serves-platform/          # Frontend Next.js
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities and types
│   ├── .env.local           # Environment variables
│   └── next.config.ts       # Next.js configuration
├── google-apps-script/      # Backend Google Apps Script
│   ├── Code.gs              # Main API handler
│   ├── Auth.gs              # Authentication logic
│   ├── Database.gs          # Database operations
│   └── CRUD.gs              # CRUD operations
└── DEPLOYMENT.md            # Deployment guide
```

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- Cuenta de Google (para Sheets y Apps Script)
- Cuenta de Vercel (para deployment del frontend)

### 1. Configuración del Backend

1. Sigue las instrucciones en `google-apps-script/README.md`
2. Despliega el Google Apps Script como Web App
3. Configura las propiedades del script (API token, JWT secret, etc.)

### 2. Configuración del Frontend

```bash
cd serves-platform
npm install
cp .env.example .env.local
# Edita .env.local con tus configuraciones
npm run dev
```

### 3. Deployment

Consulta `DEPLOYMENT.md` para instrucciones completas de deployment.

## Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
npm run type-check   # Verificación de tipos TypeScript
```

### Estructura de Roles

- **admin_lider**: Acceso completo a todas las funcionalidades
- **admin**: Gestión de usuarios y configuración del sistema
- **editor**: CRUD en proyectos asignados, gestión de actividades
- **tecnico**: Solo lectura y registro de horas en asignaciones

## Módulos Principales

### 1. Dashboard
- KPIs operacionales
- Alertas y notificaciones
- Resumen de proyectos activos

### 2. Gestión de Proyectos
- Lista y búsqueda de proyectos
- Vista detallada con tabs (Actividades, Materiales, Personal, etc.)
- Kanban board para actividades
- Mini Gantt semanal

### 3. Gestión de Personal
- Catálogo de colaboradores
- Gestión de asignaciones
- Registro de horas trabajadas
- Seguimiento de certificaciones

### 4. Gestión de Materiales
- Catálogo de materiales
- Control de stock y alertas
- BOM por actividad
- Solicitudes de compra

### 5. Reportes
- Reportes operacionales
- Reportes de capacidad
- Reportes financieros
- Exportación a CSV

### 6. Administración
- Gestión de usuarios
- Configuración de catálogos
- Documentación del sistema

## API Endpoints

### Autenticación
```
POST /auth - Login de usuario
GET /whoami - Validación de JWT
```

### CRUD Genérico
```
POST /crud - Operaciones CRUD con los siguientes parámetros:
- table: nombre de la tabla
- operation: list, get, create, update, delete
- id: ID del registro (para get, update, delete)
- record: datos del registro (para create, update)
```

## Base de Datos (Google Sheets)

### Tablas Principales

- **Usuarios**: Cuentas de usuario y autenticación
- **Proyectos**: Información de proyectos
- **Actividades**: Tareas y actividades de proyectos
- **Colaboradores**: Personal y recursos humanos
- **Clientes**: Información de clientes
- **Asignaciones**: Asignación de personal a proyectos
- **Horas**: Registro de tiempo trabajado
- **Materiales**: Catálogo de materiales
- **BOM**: Lista de materiales por actividad

## Seguridad

- Autenticación JWT con expiración de 24 horas
- Hashing de contraseñas con SHA-256
- Control de acceso basado en roles
- Validación de tokens API
- Headers de seguridad configurados

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico y preguntas:
- Revisa la documentación en `DEPLOYMENT.md`
- Consulta los logs de Google Apps Script
- Verifica la configuración de variables de entorno