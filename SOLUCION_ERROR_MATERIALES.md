# 🚨 SOLUCIÓN INMEDIATA AL ERROR DE MATERIALES

## Problema Identificado
El error "Reintentar cargar materiales" se debe a que el Google Apps Script no está configurado correctamente o no tiene los permisos necesarios.

## ✅ SOLUCIÓN PASO A PASO

### 1. Configurar Google Apps Script (CRÍTICO)

#### A. Abrir Google Apps Script
1. Ve a [script.google.com](https://script.google.com)
2. Abre el proyecto "ServesPlatform" o crea uno nuevo
3. Copia todo el código de la carpeta `google-apps-script/`

#### B. Configurar Propiedades del Script
1. En Google Apps Script, ve a **Configuración** (ícono de engranaje)
2. Scroll hacia abajo hasta **Propiedades del script**
3. Agrega estas propiedades:

```
SHEET_ID: 1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U
API_TOKEN: demo-token-2024
JWT_SECRET: mi-secreto-jwt-super-seguro-2024
ENVIRONMENT: production
```

#### C. Ejecutar Inicialización
1. En el editor, selecciona la función `initializeProperties`
2. Haz clic en **Ejecutar**
3. Autoriza los permisos cuando se solicite

### 2. Desplegar como Aplicación Web

#### A. Nueva Implementación
1. Haz clic en **Desplegar** > **Nueva implementación**
2. Configuración:
   - **Tipo**: Aplicación web
   - **Ejecutar como**: Yo (tu email)
   - **Quién puede acceder**: Cualquier persona
3. Haz clic en **Desplegar**
4. **COPIA LA URL GENERADA** (la necesitarás)

### 3. Configurar Google Sheets

#### A. Abrir el Google Sheet
1. Ve a [este enlace](https://docs.google.com/spreadsheets/d/1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U/edit)
2. Si no tienes acceso, crea un nuevo Google Sheet

#### B. Configurar Permisos
1. Haz clic en **Compartir**
2. Cambia a "Cualquier persona con el enlace puede editar"
3. O comparte específicamente con tu email

#### C. Inicializar Datos (Si es un sheet nuevo)
1. En Google Apps Script, ejecuta la función `setupDatabase`
2. Luego ejecuta `seedInitialData`

### 4. Actualizar Variables de Entorno

#### A. Editar `.env.local`
Reemplaza la URL en `serves-platform/.env.local`:

```env
# Reemplaza con la URL de tu Google Apps Script desplegado
NEXT_PUBLIC_API_BASE_URL=TU_URL_AQUI

# Debe coincidir con el Google Apps Script
NEXT_PUBLIC_API_TOKEN=demo-token-2024

NEXT_PUBLIC_APP_NAME=ServesPlatform
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

### 5. Probar la Conexión

#### A. Reiniciar el Servidor
```bash
cd serves-platform
npm run dev
```

#### B. Probar en el Navegador
1. Ve a `http://localhost:3000/materiales`
2. Debería cargar sin errores

## 🔧 SCRIPT DE DIAGNÓSTICO

Si sigues teniendo problemas, ejecuta este diagnóstico:

### A. Probar API Directamente
Abre la consola del navegador y ejecuta:

```javascript
// Reemplaza con tu URL de Google Apps Script
const API_URL = 'TU_URL_AQUI';
const API_TOKEN = 'demo-token-2024';

fetch(`${API_URL}?token=${API_TOKEN}&action=crud&table=Materiales&operation=list`)
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta de la API:', data);
    if (data.ok) {
      console.log('✅ API funcionando correctamente');
      console.log('Materiales encontrados:', data.data?.length || 0);
    } else {
      console.log('❌ Error en la API:', data.message);
    }
  })
  .catch(error => {
    console.log('❌ Error de conexión:', error);
  });
```

### B. Verificar Variables de Entorno
En la consola del navegador (en tu app):

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('API Token:', process.env.NEXT_PUBLIC_API_TOKEN);
```

## 🚀 SOLUCIÓN RÁPIDA ALTERNATIVA

Si necesitas una solución inmediata, puedes usar datos de prueba:

### A. Crear Archivo de Datos Mock
Crea `serves-platform/src/lib/mockData.ts`:

```typescript
export const mockMaterials = [
  {
    id: '1',
    sku: 'MAT001',
    descripcion: 'Cemento Portland Tipo I',
    categoria: 'Construcción',
    unidad: 'Bolsa',
    costo_ref: 25.50,
    stock_actual: 100,
    stock_minimo: 20,
    proveedor_principal: 'Cementos Lima',
    activo: true
  },
  // Agregar más materiales...
];
```

### B. Modificar Temporalmente el API Client
En `serves-platform/src/lib/apiClient.ts`, agrega al inicio:

```typescript
import { mockMaterials } from './mockData';

// En el método getMaterials, agrega:
async getMaterials(params?: { limit?: number; q?: string }) {
  // Usar datos mock temporalmente
  if (process.env.NODE_ENV === 'development') {
    return {
      ok: true,
      data: mockMaterials,
      message: 'Datos de prueba'
    };
  }
  
  // Código original...
  return this.list<Material>('Materiales', params);
}
```

## 📞 CONTACTO PARA SOPORTE

Si sigues teniendo problemas:

1. **Verifica que el Google Apps Script esté desplegado**
2. **Confirma que el Google Sheet tenga permisos**
3. **Asegúrate de que las variables de entorno coincidan**
4. **Revisa la consola del navegador para errores específicos**

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Google Apps Script desplegado como aplicación web
- [ ] Propiedades del script configuradas
- [ ] Google Sheet con permisos correctos
- [ ] Variables de entorno actualizadas
- [ ] Servidor reiniciado
- [ ] Prueba de conexión exitosa

Una vez que esto funcione, podemos proceder con la personalización completa de colores, textos y logo.