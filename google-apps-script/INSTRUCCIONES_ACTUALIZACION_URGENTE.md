# 🚨 INSTRUCCIONES URGENTES - ACTUALIZAR GOOGLE APPS SCRIPT

## ⚡ PROBLEMA ACTUAL
La plataforma no puede cargar datos porque el Google Apps Script no tiene las funciones necesarias que esperan las APIs del frontend.

## 🔧 SOLUCIÓN INMEDIATA

### PASO 1: Ir a Google Apps Script
1. Ve a https://script.google.com
2. Abre tu proyecto "ServesPlatform" 
3. Busca el archivo `Code.gs`

### PASO 2: Reemplazar TODO el código
1. **SELECCIONA TODO** el código actual en `Code.gs` (Ctrl+A)
2. **BORRA TODO** el código existente
3. **COPIA EXACTAMENTE** todo el código del archivo `Code-ACTUALIZADO-COMPLETO.gs`
4. **PEGA** el código nuevo en `Code.gs`

### PASO 3: Guardar y Desplegar
1. Haz clic en **"Guardar"** (Ctrl+S)
2. Haz clic en **"Desplegar"** → **"Nueva implementación"**
3. Selecciona **"Aplicación web"**
4. En "Ejecutar como": **"Yo"**
5. En "Quién tiene acceso": **"Cualquier persona"**
6. Haz clic en **"Implementar"**
7. **COPIA LA URL** que te da (debe terminar en `/exec`)

### PASO 4: Verificar la URL
La URL debe ser similar a:
```
https://script.google.com/macros/s/AKfycby.../exec
```

Si es diferente a la que tienes en `.env.local`, actualízala.

## ✅ QUÉ INCLUYE LA ACTUALIZACIÓN

### Funciones Nuevas Agregadas:
- ✅ `getDashboardStats` - Estadísticas del dashboard
- ✅ `getProyectos` - Lista de proyectos
- ✅ `getTareas` - Lista de tareas  
- ✅ `getUsuarios` - Lista de usuarios
- ✅ `getClientes` - Lista de clientes
- ✅ `getMateriales` - Lista de materiales
- ✅ `getLineasServicio` - Lista de líneas de servicio
- ✅ `createUsuario` - Crear usuario
- ✅ `createLineaServicio` - Crear línea de servicio
- ✅ `createCliente` - Crear cliente
- ✅ `createMaterial` - Crear material
- ✅ `login` - Autenticación

### Datos de Prueba Incluidos:
- 👥 **Usuarios**: admin@servesplatform.com / admin123
- 🏗️ **Proyectos**: 3 proyectos de ejemplo con progreso
- ✅ **Tareas**: Tareas pendientes y en progreso
- 🏢 **Clientes**: Inmobiliaria ABC, Empresa XYZ
- 📦 **Materiales**: Cemento, fierro, ladrillos, etc.
- 🔧 **Líneas de Servicio**: Eléctrico, Plomería, Construcción

## 🧪 PROBAR LA ACTUALIZACIÓN

### Después de actualizar, prueba:
1. **Login**: admin@servesplatform.com / admin123
2. **Dashboard**: Debe mostrar estadísticas reales
3. **Crear Usuario**: Debe funcionar sin errores
4. **Crear Línea de Servicio**: Debe guardarse correctamente

## ⚠️ IMPORTANTE
- **NO cambies** la estructura del código
- **COPIA TODO** exactamente como está
- **VERIFICA** que la URL del deployment sea correcta
- **PRUEBA** el login después de actualizar

## 🆘 SI TIENES PROBLEMAS
1. Verifica que copiaste TODO el código
2. Asegúrate de que el deployment sea público
3. Comprueba que la URL termine en `/exec`
4. Revisa los logs en Google Apps Script (Ver → Registros)

---

**Una vez actualizado, la plataforma debería funcionar completamente sin errores de carga.**