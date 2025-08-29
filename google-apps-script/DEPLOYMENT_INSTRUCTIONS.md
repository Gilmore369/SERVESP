# Google Apps Script - Instrucciones de Despliegue

## 📋 Configuración Actualizada

El archivo `Code.gs` ha sido actualizado para conectarse correctamente con el Google Sheets:

**Google Sheets URL**: https://docs.google.com/spreadsheets/d/1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U/edit?gid=0#gid=0

**SHEET_ID**: `1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U`

## 🚀 Pasos para Desplegar

### 1. Abrir Google Apps Script
1. Ve a [script.google.com](https://script.google.com)
2. Abre tu proyecto existente o crea uno nuevo
3. Reemplaza todo el contenido del archivo `Code.gs` con el contenido actualizado

### 2. Configurar Propiedades del Script
1. En Google Apps Script, ve a **Configuración** (⚙️) en el menú lateral
2. En la sección **Propiedades del script**, agrega las siguientes propiedades:

```
SHEET_ID = 1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U
API_TOKEN = production-token-2024
JWT_SECRET = mi-secreto-jwt-super-seguro-2024
```

### 3. Configurar Permisos
1. Ve a **Editor** y ejecuta cualquier función para activar los permisos
2. Autoriza el acceso a Google Sheets cuando se solicite
3. Asegúrate de que el script tenga permisos para:
   - Leer y escribir en Google Sheets
   - Acceder a propiedades del script

### 4. Desplegar como Web App
1. Haz clic en **Desplegar** > **Nueva implementación**
2. Selecciona **Aplicación web** como tipo
3. Configura:
   - **Descripción**: ServesPlatform API v2.0
   - **Ejecutar como**: Yo (tu cuenta)
   - **Quién tiene acceso**: Cualquier persona
4. Haz clic en **Desplegar**
5. Copia la URL de la aplicación web

### 5. Actualizar Frontend
Actualiza el archivo `.env.production` en el frontend con la nueva URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://script.google.com/macros/s/[TU_DEPLOYMENT_ID]/exec
NEXT_PUBLIC_API_TOKEN=production-token-2024
```

## 📊 Hojas Esperadas en Google Sheets

El script está configurado para trabajar con las siguientes hojas:

### Hojas Principales
- **Usuarios** - Gestión de usuarios del sistema
- **Clientes** - Información de clientes
- **Proyectos** - Gestión de proyectos
- **Actividades** - Actividades de proyectos
- **Colaboradores** - Información de colaboradores
- **Materiales** - Inventario de materiales

### Hojas Auxiliares
- **Asignaciones** - Asignaciones de recursos
- **Horas** - Registro de horas trabajadas
- **BOM** - Bill of Materials
- **Config** - Configuraciones del sistema
- **Checklists** - Listas de verificación
- **ActivityChecklists** - Checklists por actividad
- **Evidencias** - Evidencias de trabajo
- **Documentos** - Gestión de documentos
- **CategoriaDocumentos** - Categorías de documentos
- **DocumentosProyecto** - Documentos por proyecto
- **AuditLog** - Registro de auditoría

## 🔧 Cambios Realizados

### 1. Configuración de SHEET_ID
- Actualizado para usar el ID específico del Google Sheets
- Configurado como fallback en caso de que no esté en Properties Service

### 2. Funciones de Acceso a Datos
- `getOptimizedSheetData()` ahora usa `SpreadsheetApp.openById()`
- Mejor manejo de errores cuando las hojas no existen
- Logging mejorado para debugging

### 3. Health Check
- Actualizado para verificar conectividad con el Google Sheets específico
- Incluye información del spreadsheet en la respuesta
- Mejor manejo de errores de acceso

### 4. Validación de Tablas
- Lista actualizada de tablas válidas
- Validación mejorada de nombres de hojas

## 🧪 Pruebas

### 1. Probar Health Check
```bash
curl "https://script.google.com/macros/s/[TU_DEPLOYMENT_ID]/exec?token=production-token-2024&action=health"
```

### 2. Probar Conectividad
```bash
npm run test:api:connectivity
```

### 3. Probar CRUD
```bash
npm run test:api:crud
```

### 4. Pruebas Integrales
```bash
npm run system:comprehensive-test
```

## 🔍 Debugging

### Si no se conecta a Google Sheets:
1. Verifica que el SHEET_ID esté configurado correctamente
2. Asegúrate de que el script tenga permisos para acceder al spreadsheet
3. Verifica que las hojas tengan los nombres correctos
4. Revisa los logs en Google Apps Script (Ver > Registros)

### Si las pruebas fallan:
1. Verifica que la URL del API esté actualizada en `.env.production`
2. Asegúrate de que el token API coincida
3. Verifica que el Google Sheets esté accesible públicamente o compartido con la cuenta del script

## 📝 Notas Importantes

1. **Permisos**: El script necesita permisos para acceder al Google Sheets específico
2. **Tokens**: Usa tokens seguros en producción, no los tokens de demo
3. **Backup**: Haz backup del Google Sheets antes de hacer cambios importantes
4. **Monitoreo**: Usa los scripts de monitoreo para verificar el estado del sistema

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en Google Apps Script
2. Ejecuta las pruebas de conectividad
3. Verifica la configuración de permisos
4. Asegúrate de que todas las hojas existan en el Google Sheets