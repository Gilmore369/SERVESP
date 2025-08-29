# 🚀 Guía Rápida: Redeploy Google Apps Script

## ✅ Estado Actual
- ✅ Conexión establecida con Google Sheets
- ✅ Endpoints funcionando correctamente
- ⚠️ **Necesita redeploy** para mostrar datos reales en lugar de datos de prueba

## 🔄 Pasos para Redeploy

### 1. Abrir Google Apps Script
1. Ve a: https://script.google.com/
2. Busca tu proyecto o usa este enlace directo si tienes acceso:
   - ID del script: `AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg`

### 2. Actualizar el Código
1. Abre el archivo `Code.gs` en Google Apps Script
2. **Selecciona todo el contenido** (Ctrl+A)
3. **Copia el contenido actualizado** del archivo `google-apps-script/Code.gs` de este proyecto
4. **Pega el nuevo código** reemplazando todo el contenido anterior
5. **Guarda** el archivo (Ctrl+S)

### 3. Hacer el Deploy
1. Haz clic en **"Implementar"** (Deploy) en la parte superior derecha
2. Selecciona **"Nueva implementación"** (New deployment)
3. En "Tipo", selecciona **"Aplicación web"** (Web app)
4. Configura:
   - **Descripción**: "Actualización métricas dashboard - v2"
   - **Ejecutar como**: "Yo" (Me)
   - **Quién puede acceder**: "Cualquier persona" (Anyone)
5. Haz clic en **"Implementar"** (Deploy)
6. **Copia la nueva URL** si es diferente (aunque debería ser la misma)

### 4. Verificar el Deploy
Ejecuta este comando para probar:

```bash
node test-google-sheets-connection.js
```

O usa curl:
```bash
curl "https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec?action=getDashboardStats&token=demo-token-2024"
```

## 🎯 Resultados Esperados

### Antes del Redeploy (Datos de Prueba):
```json
{
  "activeProjects": 8,
  "activePersonnel": 24,
  "pendingTasks": 12,
  "remainingBudget": 250000
}
```

### Después del Redeploy (Datos Reales):
```json
{
  "activeProjects": 1,    // Basado en datos reales de Google Sheets
  "activePersonnel": 1,   // Colaboradores activos
  "pendingTasks": 0,      // Actividades pendientes
  "remainingBudget": 50000 // Calculado desde presupuestos de proyectos
}
```

## 🔍 Cambios Incluidos en la Actualización

### Mejoras en el Cálculo de Métricas:

1. **Proyectos Activos**: 
   - Antes: Solo "En progreso" o "Activo"
   - Ahora: Todos excepto "Completado", "Cancelado", "Terminado"

2. **Personal Activo**:
   - Antes: Solo campo `activo === true`
   - Ahora: `activo === true` O `estado === "Activo"`

3. **Tareas Pendientes**:
   - Antes: Solo "Pendiente"
   - Ahora: "Pendiente", "En progreso", "Asignado"

4. **Presupuesto Restante**:
   - Antes: Valor fijo de 250,000
   - Ahora: Calculado desde `presupuesto_total` y `avance_pct` de proyectos

5. **Logging Mejorado**:
   - Detalles de cálculo para debugging
   - Mejor manejo de errores

## 🚨 Solución de Problemas

### Si sigues viendo datos de prueba después del redeploy:

1. **Espera 1-2 minutos** - Google Apps Script puede tardar en actualizar
2. **Recarga el dashboard** completamente (Ctrl+F5)
3. **Verifica la consola** del navegador por errores
4. **Usa el diagnóstico** en el dashboard (botón azul en esquina inferior derecha)

### Si hay errores:

1. **Revisa los logs** en Google Apps Script (Ver > Registros de ejecución)
2. **Verifica permisos** - El script debe tener acceso a Google Sheets
3. **Confirma la URL** - Debe ser exactamente la misma en `.env.local`

## ✅ Confirmación de Éxito

Sabrás que el redeploy fue exitoso cuando:

1. **El banner en el dashboard** cambie de amarillo (⚠️ Usando Datos de Prueba) a verde (✅ Conectado a Google Sheets)
2. **Los valores de métricas** cambien de (8, 24, 12, 250000) a valores basados en tus datos reales
3. **La consola del navegador** muestre: `✅ Dashboard metrics from Google Sheets`

¡Una vez completado el redeploy, tu dashboard estará completamente integrado con Google Sheets y mostrará datos reales!