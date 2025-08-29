# Configuración de Integración con Google Sheets

## ✅ Cambios Realizados

### 1. Configuración de Desarrollo
- ✅ Agregado `NEXT_PUBLIC_FORCE_REAL_API=true` en `.env.local`
- ✅ Modificado `development-mode.ts` para permitir API real cuando se configure
- ✅ Actualizado el dashboard service para usar datos reales

### 2. Backend de Google Apps Script
- ✅ Agregado endpoint `getDashboardStats` en `Code.gs`
- ✅ Función `handleGetDashboardStats()` implementada
- ✅ Cálculo de métricas desde hojas reales

### 3. Frontend
- ✅ Corregido el endpoint `/api/dashboard/stats` para incluir token
- ✅ Actualizado `dashboard-service.ts` para usar endpoint de estadísticas
- ✅ Agregado componente de diagnóstico `ConnectionDiagnostic`
- ✅ Corregido problema de importación en `KPICards.tsx`

### 4. Herramientas de Diagnóstico
- ✅ Script de prueba `test-google-sheets-connection.js`
- ✅ Componente de diagnóstico en el dashboard
- ✅ Logging mejorado para debugging

## 🚀 Pasos para Activar la Integración

### Paso 1: Verificar Variables de Entorno
Asegúrate de que tu archivo `.env.local` contenga:

```env
# API Configuration - URL ACTUALIZADA Y FUNCIONAL
NEXT_PUBLIC_API_BASE_URL=https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec
NEXT_PUBLIC_API_TOKEN=demo-token-2024

# Force Real API Usage (bypass development mode mock data)
NEXT_PUBLIC_FORCE_REAL_API=true
```

### Paso 2: Actualizar Google Apps Script
1. Abre el Google Apps Script en: https://script.google.com/
2. Busca tu proyecto con ID: `AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg`
3. Reemplaza el contenido de `Code.gs` con el archivo actualizado `google-apps-script/Code.gs`
4. Guarda y despliega una nueva versión

### Paso 3: Verificar Google Sheets
Asegúrate de que tu Google Sheets tenga las siguientes hojas:
- ✅ **Proyectos** - Con columnas: id, nombre, descripcion, estado, progreso, fecha_inicio, fecha_fin
- ✅ **Colaboradores** - Con columnas: id, nombre, cargo, activo, estado
- ✅ **Actividades** - Con columnas: id, nombre, proyecto_nombre, estado, prioridad, fecha_vencimiento

### Paso 4: Probar la Conexión

#### Opción A: Usar el Script de Prueba
```bash
node test-google-sheets-connection.js
```

#### Opción B: Usar el Diagnóstico del Dashboard
1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve al dashboard: http://localhost:3000/dashboard
3. Haz clic en el botón de diagnóstico (círculo azul en la esquina inferior derecha)
4. Ejecuta el diagnóstico y revisa los resultados

### Paso 5: Verificar Datos en el Dashboard
1. Recarga el dashboard
2. Las métricas KPI deberían mostrar datos reales de Google Sheets
3. Si ves datos diferentes a los mock (8, 24, 12, 250000), ¡la integración está funcionando!

## 🔍 Solución de Problemas

### Problema: Aún se muestran datos mock
**Solución:**
1. Verifica que `NEXT_PUBLIC_FORCE_REAL_API=true` esté en `.env.local`
2. Reinicia el servidor de desarrollo
3. Abre las herramientas de desarrollador y revisa la consola por errores

### Problema: Error de CORS
**Solución:**
1. Verifica que el Google Apps Script esté desplegado correctamente
2. Asegúrate de que la URL en `.env.local` sea la correcta
3. Verifica que el token sea `demo-token-2024`

### Problema: Error 401 (Unauthorized)
**Solución:**
1. Verifica que el token en `.env.local` coincida con el configurado en Google Apps Script
2. Asegúrate de que el token se esté enviando correctamente

### Problema: Error 404 (Not Found)
**Solución:**
1. Verifica que la URL del Google Apps Script sea correcta
2. Asegúrate de que el script esté desplegado y público

## 📊 Estructura de Datos Esperada

### Google Sheets - Hoja "Proyectos"
```
| id | nombre | descripcion | estado | progreso | fecha_inicio | fecha_fin |
|----|--------|-------------|--------|----------|--------------|-----------|
| 1  | Villa Los Olivos | Construcción residencial | En progreso | 75 | 2024-01-15 | 2024-12-30 |
```

### Google Sheets - Hoja "Colaboradores"
```
| id | nombre | cargo | activo | estado |
|----|--------|-------|--------|--------|
| 1  | Carlos Mendoza | Arquitecto | true | Disponible |
```

### Google Sheets - Hoja "Actividades"
```
| id | nombre | proyecto_nombre | estado | prioridad | fecha_vencimiento |
|----|--------|-----------------|--------|-----------|-------------------|
| 1  | Revisión planos | Villa Los Olivos | Pendiente | Alta | 2024-02-15 |
```

## 🎯 Resultados Esperados

Una vez configurado correctamente, deberías ver:

1. **Métricas KPI reales** calculadas desde Google Sheets
2. **Proyectos reales** listados en el dashboard
3. **Personal real** mostrado en la sección de equipo
4. **Tareas reales** en la lista de pendientes
5. **Logs en consola** mostrando "✅ Dashboard metrics from Google Sheets"

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en la consola del navegador
2. Usa el componente de diagnóstico en el dashboard
3. Ejecuta el script de prueba para verificar conectividad
4. Verifica que todas las configuraciones coincidan con esta guía