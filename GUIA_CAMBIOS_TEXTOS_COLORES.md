# 🎨 Guía para Cambiar Textos y Colores por Sección

## 📝 CAMBIAR NOMBRES DE SECCIONES

### 1. Archivo Principal de Navegación
**Ubicación:** `serves-platform/src/components/layout/Sidebar.tsx`

**Líneas 30-70:** Busca el array `menuItems` y modifica los nombres:

```typescript
const menuItems: MenuItem[] = [
  {
    name: 'Panel Principal',        // Era: 'Dashboard'
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Obras',                  // Era: 'Proyectos'
    href: '/proyectos',
    icon: FolderIcon,
    permissions: [Permission.VIEW_ALL_PROJECTS, Permission.VIEW_ASSIGNED_PROJECTS],
  },
  {
    name: 'Equipo',                 // Era: 'Personal'
    href: '/personal',
    icon: UsersIcon,
    permissions: [Permission.VIEW_ALL_PERSONNEL],
  },
  {
    name: 'Inventario',             // Era: 'Materiales'
    href: '/materiales',
    icon: CubeIcon,
    permissions: [Permission.VIEW_MATERIALS],
  },
  {
    name: 'Informes',               // Era: 'Reportes'
    href: '/reportes',
    icon: DocumentChartBarIcon,
    permissions: [Permission.VIEW_OPERATIONAL_REPORTS, Permission.VIEW_FINANCIAL_REPORTS, Permission.VIEW_CAPACITY_REPORTS],
  },
  {
    name: 'Listas de Verificación', // Era: 'Checklists'
    href: '/admin/checklists',
    icon: CheckCircleIcon,
    permissions: [Permission.MANAGE_CHECKLISTS],
  },
  {
    name: 'Configuración',          // Mantener igual
    href: '/admin',
    icon: CogIcon,
    permissions: [Permission.MANAGE_SYSTEM_CONFIG, Permission.MANAGE_CATALOGS],
  },
  {
    name: 'Ayuda',                  // Era: 'Documentación'
    href: '/docs',
    icon: BookOpenIcon,
    permissions: [Permission.VIEW_DOCUMENTS],
  },
];
```

### 2. Títulos de Páginas Principales

#### Dashboard
**Archivo:** `serves-platform/src/app/dashboard/page.tsx`
**Línea ~15:** Cambiar `<h1>Dashboard</h1>` por `<h1>Panel Principal</h1>`

#### Proyectos
**Archivo:** `serves-platform/src/app/proyectos/page.tsx`
**Línea ~20:** Cambiar títulos relacionados con "Proyectos" por "Obras"

#### Personal
**Archivo:** `serves-platform/src/app/personal/page.tsx`
**Línea ~18:** Cambiar "Personal" por "Equipo"

#### Materiales
**Archivo:** `serves-platform/src/app/materiales/page.tsx`
**Línea ~188:** Cambiar "Gestión de Materiales" por "Gestión de Inventario"

#### Reportes
**Archivo:** `serves-platform/src/app/reportes/page.tsx`
**Línea ~15:** Cambiar "Reportes" por "Informes"

### 3. Cambiar Nombre de la Aplicación

#### A. En el Sidebar
**Archivo:** `serves-platform/src/components/layout/Sidebar.tsx`
**Línea ~105:** Cambiar:
```typescript
<h1 className="text-lg font-semibold text-gray-900">ServesPlatform</h1>
```
Por:
```typescript
<h1 className="text-lg font-semibold text-gray-900">TU_NOMBRE_AQUI</h1>
```

#### B. En las Variables de Entorno
**Archivo:** `serves-platform/.env.local`
```env
NEXT_PUBLIC_APP_NAME=TU_NOMBRE_AQUI
```

#### C. En el Package.json
**Archivo:** `serves-platform/package.json`
**Línea 2:** Cambiar:
```json
"name": "serves-platform",
```
Por:
```json
"name": "tu-nombre-aqui",
```

---

## 🎨 CAMBIAR COLORES POR SECCIÓN

### 1. Configuración de Colores Base
**Archivo:** `serves-platform/tailwind.config.js`

Agregar colores personalizados:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Dashboard - Azul
        dashboard: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Proyectos/Obras - Verde
        projects: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        // Personal/Equipo - Púrpura
        personnel: {
          50: '#faf5ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        // Materiales/Inventario - Naranja
        materials: {
          50: '#fff7ed',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        // Reportes/Informes - Teal
        reports: {
          50: '#f0fdfa',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        // Administración - Rojo
        admin: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Documentación/Ayuda - Índigo
        docs: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      }
    }
  }
}
```

### 2. Aplicar Colores por Sección

#### A. Dashboard
**Archivos a modificar:**
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/*.tsx`

**Cambios típicos:**
```typescript
// Cambiar de:
className="bg-blue-600 text-white"
// A:
className="bg-dashboard-600 text-white"

// Cambiar de:
className="text-blue-600"
// A:
className="text-dashboard-600"
```

#### B. Proyectos/Obras
**Archivos a modificar:**
- `src/app/proyectos/*.tsx`
- `src/components/projects/*.tsx`

**Cambios típicos:**
```typescript
// Botones principales
className="bg-projects-600 hover:bg-projects-700 text-white"

// Iconos y acentos
className="text-projects-600"

// Fondos suaves
className="bg-projects-50"
```

#### C. Personal/Equipo
**Archivos a modificar:**
- `src/app/personal/*.tsx`
- `src/components/personnel/*.tsx`

**Cambios típicos:**
```typescript
className="bg-personnel-600 hover:bg-personnel-700 text-white"
className="text-personnel-600"
className="bg-personnel-50"
```

#### D. Materiales/Inventario
**Archivos a modificar:**
- `src/app/materiales/*.tsx`
- `src/components/materials/*.tsx`

**Cambios típicos:**
```typescript
className="bg-materials-600 hover:bg-materials-700 text-white"
className="text-materials-600"
className="bg-materials-50"
```

#### E. Reportes/Informes
**Archivos a modificar:**
- `src/app/reportes/*.tsx`
- `src/components/reports/*.tsx`

**Cambios típicos:**
```typescript
className="bg-reports-600 hover:bg-reports-700 text-white"
className="text-reports-600"
className="bg-reports-50"
```

### 3. Script Automatizado para Cambios

Crea este archivo: `serves-platform/scripts/update-colors.js`

```javascript
const fs = require('fs');
const path = require('path');

const colorMappings = {
  'blue-600': 'dashboard-600',
  'blue-500': 'dashboard-500',
  'blue-700': 'dashboard-700',
  'green-600': 'projects-600',
  'green-500': 'projects-500',
  'green-700': 'projects-700',
  // Agregar más mappings...
};

function updateColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  Object.entries(colorMappings).forEach(([oldColor, newColor]) => {
    if (content.includes(oldColor)) {
      content = content.replace(new RegExp(oldColor, 'g'), newColor);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated colors in: ${filePath}`);
  }
}

// Ejecutar en directorios específicos
const directories = [
  'src/app/dashboard',
  'src/components/dashboard',
  'src/app/proyectos',
  'src/components/projects',
  // Agregar más directorios...
];

directories.forEach(dir => {
  // Lógica para recorrer archivos...
});
```

---

## 🖼️ CAMBIAR LOGO

### 1. Preparar tu Logo
- **Formato recomendado:** SVG (escalable)
- **Tamaño para header:** 200x50px máximo
- **Favicon:** 32x32px en formato ICO o PNG

### 2. Ubicaciones del Logo

#### A. Logo Principal
**Archivo:** `serves-platform/public/logo.svg`
- Reemplaza este archivo con tu logo

#### B. Favicon
**Archivo:** `serves-platform/public/favicon.ico`
- Reemplaza con tu favicon

#### C. Logo en el Sidebar
**Archivo:** `serves-platform/src/components/layout/Sidebar.tsx`
**Líneas 100-105:** Cambiar el logo temporal por tu imagen:

```typescript
// Cambiar de:
<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
  <span className="text-white font-bold text-sm">SP</span>
</div>

// A:
<img 
  src="/logo.svg" 
  alt="Logo de tu empresa" 
  className="w-8 h-8"
/>
```

#### D. Logo en el Header (si existe)
**Archivo:** `serves-platform/src/components/layout/Header.tsx`
- Buscar referencias a logo y reemplazar

### 3. Actualizar Metadatos
**Archivo:** `serves-platform/src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Tu Nombre de Empresa',
  description: 'Tu descripción aquí',
  icons: {
    icon: '/favicon.ico',
  },
}
```

---

## ✅ CHECKLIST DE CAMBIOS

### Textos
- [ ] Nombres en `Sidebar.tsx`
- [ ] Títulos en cada `page.tsx`
- [ ] Nombre de app en variables de entorno
- [ ] Nombre en `package.json`
- [ ] Metadatos en `layout.tsx`

### Colores
- [ ] Configurar paleta en `tailwind.config.js`
- [ ] Actualizar Dashboard
- [ ] Actualizar Proyectos/Obras
- [ ] Actualizar Personal/Equipo
- [ ] Actualizar Materiales/Inventario
- [ ] Actualizar Reportes/Informes
- [ ] Actualizar Administración
- [ ] Actualizar Documentación/Ayuda

### Logo
- [ ] Reemplazar `logo.svg`
- [ ] Reemplazar `favicon.ico`
- [ ] Actualizar referencia en Sidebar
- [ ] Actualizar metadatos

### Pruebas
- [ ] Reiniciar servidor de desarrollo
- [ ] Verificar cada sección
- [ ] Probar en móvil
- [ ] Verificar accesibilidad

---

## 🚀 COMANDOS PARA APLICAR CAMBIOS

```bash
# Reiniciar servidor después de cambios
cd serves-platform
npm run dev

# Construir para producción
npm run build

# Verificar que no hay errores
npm run lint
```

¿Te gustaría que implemente alguno de estos cambios específicos o necesitas ayuda con alguna sección en particular?