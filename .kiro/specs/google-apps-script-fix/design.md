# Design Document

## Overview

El problema principal es que el Google Apps Script actual está incompleto y no puede manejar las operaciones CRUD requeridas por la aplicación frontend ServesPlatform. El script actual tiene la estructura básica pero le faltan las funciones críticas para manejar materiales y otras entidades.

La solución consiste en reemplazar el código incompleto del Google Apps Script con una versión completa que incluya todas las funciones CRUD necesarias, manejo robusto de errores, y datos de prueba para permitir el funcionamiento inmediato de la aplicación.

## Architecture

### Current State
- Google Apps Script desplegado en: `https://script.google.com/macros/s/AKfycbwZ4fWws4N-4BL8f1dmG6tBVbo8KEfcS3e1U6MPSSLSYv2GZaXNdhsb9B6BpzDechnAyw/exec`
- Frontend configurado para usar este endpoint
- Script actual tiene estructura básica pero funciones incompletas

### Target State
- Google Apps Script completo con todas las funciones CRUD
- Manejo robusto de errores con mensajes informativos
- Datos de prueba (mock data) para materiales y otras entidades
- Configuración fija para evitar problemas de propiedades del script

### Communication Flow
```
Frontend (Next.js) → API Client → Google Apps Script → Response
```

El frontend usa el `apiClient.ts` que convierte todas las peticiones a GET con parámetros de query para evitar problemas de CORS con Google Apps Script.

## Components and Interfaces

### 1. Main Request Handler
- **Function**: `handleRequest(e)`
- **Purpose**: Punto de entrada principal que procesa todas las peticiones
- **Responsibilities**:
  - Validar token de API
  - Parsear parámetros de la petición
  - Enrutar a los handlers apropiados
  - Manejo de errores global

### 2. CRUD Handler
- **Function**: `handleCRUD(data)`
- **Purpose**: Manejar todas las operaciones CRUD
- **Operations**:
  - `list`: Obtener lista de entidades
  - `get`: Obtener entidad específica por ID
  - `create`: Crear nueva entidad
  - `update`: Actualizar entidad existente
  - `delete`: Eliminar entidad

### 3. Authentication Handler
- **Function**: `handleAuth(data)`
- **Purpose**: Manejar autenticación de usuarios
- **Features**:
  - Validación de credenciales
  - Generación de tokens de acceso
  - Usuario de prueba predefinido

### 4. Entity-Specific Handlers
- **Materials Handler**: Devuelve datos de prueba para materiales de construcción
- **Generic Handlers**: Para otras entidades (usuarios, proyectos, etc.)

### 5. Response Formatters
- **Success Response**: Formato estándar para respuestas exitosas
- **Error Response**: Formato estándar para errores con códigos de estado

## Data Models

### Material Model
```javascript
{
  id: string,
  sku: string,
  descripcion: string,
  categoria: string,
  unidad: string,
  costo_ref: number,
  stock_actual: number,
  stock_minimo: number,
  proveedor_principal: string,
  activo: boolean,
  fecha_creacion: string (ISO),
  fecha_actualizacion: string (ISO)
}
```

### API Response Model
```javascript
// Success Response
{
  ok: true,
  data: any,
  timestamp: string (ISO)
}

// Error Response
{
  ok: false,
  message: string,
  status: number,
  timestamp: string (ISO)
}
```

### Configuration Model
```javascript
{
  SHEET_ID: string,
  API_TOKEN: string,
  JWT_SECRET: string,
  ENVIRONMENT: string
}
```

## Error Handling

### Error Types
1. **Authentication Errors (401)**
   - Token inválido o faltante
   - Credenciales incorrectas

2. **Validation Errors (400)**
   - Parámetros faltantes
   - Operaciones inválidas
   - Datos malformados

3. **Server Errors (500)**
   - Errores internos del script
   - Problemas de parsing
   - Excepciones no controladas

### Error Response Strategy
- Todos los errores devuelven un formato JSON consistente
- Mensajes de error informativos y específicos
- Códigos de estado HTTP apropiados
- Timestamp para debugging
- Logging de errores en consola para diagnóstico

### Fallback Mechanisms
- Datos de prueba (mock data) cuando no hay datos reales
- Configuración hardcodeada para evitar dependencias de propiedades del script
- Respuestas por defecto para operaciones no implementadas

## Testing Strategy

### Manual Testing
1. **API Endpoint Testing**
   - Probar URL directamente en navegador
   - Verificar respuestas JSON válidas
   - Validar códigos de estado

2. **Frontend Integration Testing**
   - Cargar página de materiales
   - Verificar que no aparezcan errores
   - Confirmar que los datos se muestran correctamente

3. **Authentication Testing**
   - Probar login con credenciales válidas
   - Verificar manejo de credenciales inválidas
   - Confirmar generación de tokens

### Diagnostic Tools
- Script de diagnóstico en consola del navegador
- Logging detallado en Google Apps Script
- Verificación de variables de entorno

### Test Data
- 5 materiales de construcción de ejemplo
- Usuario administrador de prueba
- Respuestas mock para todas las operaciones CRUD

## Implementation Phases

### Phase 1: Core CRUD Functions
- Implementar `handleCRUD` y operaciones básicas
- Agregar datos de prueba para materiales
- Configurar manejo básico de errores

### Phase 2: Authentication & Security
- Implementar `handleAuth` con usuario de prueba
- Agregar validación de tokens
- Configurar `handleWhoAmI`

### Phase 3: Error Handling & Robustness
- Mejorar manejo de errores con mensajes específicos
- Agregar logging detallado
- Implementar fallbacks para casos edge

### Phase 4: Testing & Validation
- Probar todas las operaciones CRUD
- Verificar integración con frontend
- Validar manejo de errores

## Security Considerations

### API Token Validation
- Validación obligatoria del token en todas las peticiones
- Token hardcodeado para simplicidad en desarrollo
- Mensajes de error que no revelan información sensible

### Input Validation
- Validación de parámetros requeridos
- Sanitización de datos de entrada
- Prevención de inyección de código

### Error Information Disclosure
- Mensajes de error informativos pero no sensibles
- No exposición de detalles internos del sistema
- Logging seguro de errores para debugging

## Performance Considerations

### Response Optimization
- Respuestas JSON minificadas
- Datos de prueba limitados para velocidad
- Caché de configuración en memoria

### Request Handling
- Procesamiento eficiente de parámetros
- Validación temprana para fallar rápido
- Manejo asíncrono donde sea posible

## Deployment Strategy

### Google Apps Script Deployment
1. Reemplazar código completo en el script existente
2. Guardar y desplegar como aplicación web
3. Mantener la misma URL para evitar cambios en frontend
4. Verificar permisos y configuración

### Configuration Management
- Configuración hardcodeada para evitar problemas
- Variables de entorno del frontend ya configuradas
- No requiere cambios en el frontend

### Rollback Plan
- Mantener backup del código anterior
- Posibilidad de revertir rápidamente si hay problemas
- Monitoreo de errores post-despliegue