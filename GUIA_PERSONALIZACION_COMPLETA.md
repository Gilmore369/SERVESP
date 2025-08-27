# Guía Completa de Personalización y Solución de Errores - ServesPlatform

## 🚨 SOLUCIÓN AL ERROR CRÍTICO DE MATERIALES

### Problema Identificado
El error "Reintentar cargar materiales" se debe a que la plataforma no puede conectarse correctamente con Google Sheets. Esto ocurre por:

1. **Variables de entorno faltantes o incorrectas**
2. **Google Apps Script no configurado correctamente**
3. **Permisos de Google Sheets no establecidos**

### Solución Paso a Paso

#### 1. Configurar Variables de Entorno
Edita el archivo `serves-platform/.env.local`:

```env
# URL del Google Apps Script desplegado
NEXT_PUBLIC_API_BASE_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec

# Token de seguridad (debe coincidir con el del Google Apps Script)
NEXT_PUBLIC_API_TOKEN=tu_token_secreto_aqui

# Nombre de la aplicación
NEXT_PUBLIC_APP_NAME=ServesPlatform

# Versión
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### 2. Verificar Google Apps Script
1. Ve a `google-apps-script/Code.gs`
2. Asegúrate de que el `API_TOKEN` coincida con el de tu `.env.local`
3. Verifica que el Google Sheet esté compartido correctamente
4. Despliega el script como aplicación web

#### 3. Probar la Conexión
```bash
# En la carpeta serves-platform
npm run dev
```

Luego ve a `/materiales` y verifica que cargue correctamente.

---

## 🎨 PERSONALIZACIÓN COMPLETA DE LA PLATAFORMA

### 1. CAMBIAR NOMBRE DE "Constructor Pro" A "ServesPlatform"

#### Archivos a Modificar:

**A. Configuración Principal**
- `serves-platform/src/lib/config.ts` ✅ (Ya configurado)
- `serves-platform/package.json` - Cambiar el "name"

**B. Títulos y Textos en Componentes**
- `serves-platform/src/components/layout/Header.tsx`
- `serves-platform/src/components/auth/LoginForm.tsx`
- `serves-platform/src/app/layout.tsx` (título de la página)

**C. Documentación**
- `serves-platform/README.md`
- Todos los archivos `.md` en la raíz

### 2. CAMBIAR LOGO

#### Ubicación del Logo Actual:
- `serves-platform/public/logo.svg` (si existe)
- `serves-platform/public/favicon.ico`
- `serves-platform/src/components/layout/Header.tsx` (componente que muestra el logo)

#### Pasos para Cambiar el Logo:
1. **Preparar tu logo:**
   - Formato SVG recomendado (escalable)
   - Tamaño recomendado: 200x50px para header
   - Favicon: 32x32px en formato ICO o PNG

2. **Reemplazar archivos:**
   ```bash
   # Copia tu logo a:
   serves-platform/public/logo.svg
   serves-platform/public/favicon.ico
   ```

3. **Actualizar componente Header:**
   Buscar en `serves-platform/src/components/layout/Header.tsx` y reemplazar la referencia al logo.

### 3. PERSONALIZAR COLORES POR SECCIÓN

#### Archivo Principal de Colores:
`serves-platform/tailwind.config.js`

#### Colores Actuales por Sección:

**Dashboard:** Azul (`blue-600`, `blue-500`)
- Archivos: `src/app/dashboard/page.tsx`, `src/components/dashboard/*`

**Proyectos:** Verde (`green-600`, `green-500`)
- Archivos: `src/app/proyectos/*`, `src/components/projects/*`

**Personal:** Púrpura (`purple-600`, `purple-500`)
- Archivos: `src/app/personal/*`, `src/components/personnel/*`

**Reportes:** Naranja (`orange-600`, `orange-500`)
- Archivos: `src/app/reportes/*`, `src/components/reports/*`

**Materiales:** Índigo (`indigo-600`, `indigo-500`)
- Archivos: `src/app/materiales/*`, `src/components/materials/*`

**Gestión de Usuarios:** Rojo (`red-600`, `red-500`)
- Archivos: `src/app/admin/*`, `src/components/admin/*`

**Configuración:** Gris (`gray-600`, `gray-500`)
- Archivos: `src/app/configuracion/*`

**Documentación:** Teal (`teal-600`, `teal-500`)
- Archivos: `src/app/documentacion/*`

### 4. CAMBIAR TEXTOS Y NOMBRES DE SECCIONES

#### Archivo Principal de Navegación:
`serves-platform/src/components/layout/Sidebar.tsx`

#### Textos Actuales y Ubicaciones:

| Sección Actual | Archivo Principal | Línea Aprox. |
|----------------|-------------------|--------------|
| Dashboard | `src/components/layout/Sidebar.tsx` | 30 |
| Proyectos | `src/components/layout/Sidebar.tsx` | 35 |
| Personal | `src/components/layout/Sidebar.tsx` | 40 |
| Reportes | `src/components/layout/Sidebar.tsx` | 45 |
| Materiales | `src/components/layout/Sidebar.tsx` | 50 |
| Gestión de Usuarios | `src/components/layout/Sidebar.tsx` | 55 |
| Configuración | `src/components/layout/Sidebar.tsx` | 60 |
| Documentación | `src/components/layout/Sidebar.tsx` | 65 |

#### Archivos Adicionales con Títulos:
- `src/app/*/page.tsx` - Cada página tiene su título principal
- `src/components/*/` - Componentes específicos de cada sección

---

## 🚀 DESPLIEGUE EN VERCEL

### Preparación para Producción

#### 1. Configurar Variables de Entorno en Vercel
```bash
# Variables requeridas:
NEXT_PUBLIC_API_BASE_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
NEXT_PUBLIC_API_TOKEN=tu_token_secreto
NEXT_PUBLIC_APP_NAME=ServesPlatform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### 2. Configurar Google Apps Script para Producción
1. **Abrir Google Apps Script**
2. **Configurar variables en `Code.gs`:**
   ```javascript
   const API_TOKEN = 'tu_token_secreto'; // Debe coincidir con Vercel
   const SPREADSHEET_ID = 'tu_google_sheet_id';
   ```

3. **Desplegar como aplicación web:**
   - Ir a "Desplegar" > "Nueva implementación"
   - Tipo: "Aplicación web"
   - Ejecutar como: "Yo"
   - Acceso: "Cualquier persona"
   - Copiar la URL generada

#### 3. Configurar Google Sheets
1. **Crear/Abrir tu Google Sheet**
2. **Compartir con permisos de edición**
3. **Copiar el ID del Sheet** (de la URL)
4. **Ejecutar el script de inicialización** desde Google Apps Script

#### 4. Desplegar en Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# En la carpeta serves-platform
cd serves-platform

# Desplegar
vercel

# Configurar variables de entorno en el dashboard de Vercel
```

---

## 📝 CHECKLIST DE PERSONALIZACIÓN

### Cambios Básicos
- [ ] Cambiar nombre en `package.json`
- [ ] Actualizar `NEXT_PUBLIC_APP_NAME` en variables de entorno
- [ ] Reemplazar logo en `public/logo.svg`
- [ ] Actualizar favicon en `public/favicon.ico`

### Cambios de Texto
- [ ] Títulos en `Sidebar.tsx`
- [ ] Títulos de páginas en cada `page.tsx`
- [ ] Textos del Header
- [ ] Textos de autenticación

### Cambios de Color
- [ ] Definir paleta de colores en `tailwind.config.js`
- [ ] Actualizar colores por sección
- [ ] Probar contraste y accesibilidad

### Configuración de Producción
- [ ] Variables de entorno en Vercel
- [ ] Google Apps Script configurado
- [ ] Google Sheets con permisos correctos
- [ ] Pruebas de conectividad

---

## 🛠️ COMANDOS ÚTILES

### Desarrollo Local
```bash
cd serves-platform
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción local
npm run lint         # Verificar código
```

### Despliegue
```bash
vercel               # Desplegar a Vercel
vercel --prod        # Desplegar a producción
vercel logs          # Ver logs de producción
```

### Google Apps Script
```bash
# Usar el editor web de Google Apps Script
# No hay comandos CLI específicos
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS COMUNES

### Error de CORS
- Verificar que Google Apps Script esté desplegado como "aplicación web"
- Confirmar permisos de acceso "Cualquier persona"

### Error de Autenticación
- Verificar que `API_TOKEN` coincida en ambos lados
- Revisar formato de JWT en el frontend

### Error de Permisos de Google Sheets
- Compartir el Sheet con el email del script
- Verificar que el `SPREADSHEET_ID` sea correcto

### Error de Variables de Entorno
- Reiniciar el servidor de desarrollo después de cambios
- Verificar que las variables empiecen con `NEXT_PUBLIC_`

---

¿Necesitas ayuda específica con alguna de estas secciones?