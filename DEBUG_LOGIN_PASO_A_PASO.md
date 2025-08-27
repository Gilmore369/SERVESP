# 🔍 DEBUG LOGIN PASO A PASO - ServesPlatform

## 🚨 PROBLEMA ACTUAL
- El login se queda cargando
- No redirige al dashboard
- Vuelve al estado inicial sin mostrar errores

## 📋 PASOS PARA HACER DEBUG

### 1. Abrir Herramientas de Desarrollador
1. **Presiona F12** en tu navegador
2. **Ve a la pestaña "Console"**
3. **Limpia la consola** (botón de limpiar o Ctrl+L)

### 2. Intentar Login con Logging
1. **Ingresa las credenciales**:
   - Email: `admin@servesplatform.com`
   - Password: `admin123`

2. **Haz clic en "Iniciar Sesión"**

3. **Observa los mensajes en la consola**. Deberías ver algo como:
   ```
   🔐 Iniciando login con: {email: "admin@servesplatform.com", password: "***"}
   🔑 AuthContext: Iniciando proceso de login...
   📡 AuthContext: Llamando a apiClient.login...
   🌐 APIClient: Enviando petición de login...
   🔗 APIClient: URL de petición: https://script.google.com/...
   📡 APIClient: Status de respuesta: 200
   🌐 APIClient: Respuesta recibida: {...}
   📨 AuthContext: Respuesta de API: {...}
   ```

### 3. Verificar la Respuesta de la API
En la consola, busca el mensaje **"📨 AuthContext: Respuesta de API:"**

**Si la respuesta es correcta**, deberías ver:
```javascript
{
  token: "mock-jwt-token-...",
  user: {
    id: "1",
    email: "admin@servesplatform.com",
    nombre: "Administrador",
    rol: "admin",
    activo: true
  },
  message: "Login successful"
}
```

**Si hay un problema**, verás algo diferente.

### 4. Verificar la Pestaña Network
1. **Ve a la pestaña "Network"** en las herramientas de desarrollador
2. **Limpia las peticiones** (botón de limpiar)
3. **Intenta hacer login nuevamente**
4. **Busca la petición** a Google Apps Script (debería empezar con `script.google.com`)
5. **Haz clic en la petición** para ver los detalles
6. **Ve a la pestaña "Response"** para ver qué devuelve la API

### 5. Posibles Problemas y Soluciones

#### Problema A: No aparece petición en Network
**Causa**: Error en el código antes de hacer la petición
**Solución**: Revisar errores en Console

#### Problema B: Petición falla (status 4xx o 5xx)
**Causa**: Problema con Google Apps Script
**Solución**: Verificar que el script esté desplegado correctamente

#### Problema C: Respuesta vacía o incorrecta
**Causa**: Google Apps Script no está devolviendo los datos correctos
**Solución**: Revisar el código del script

#### Problema D: Login exitoso pero no redirige
**Causa**: Error en el código de redirección
**Solución**: Verificar que aparezca "✅ Login exitoso, redirigiendo al dashboard..."

## 🛠️ COMANDOS DE DEBUG MANUAL

### En la Consola del Navegador:

#### Verificar Variables de Entorno:
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('API Token:', process.env.NEXT_PUBLIC_API_TOKEN);
```

#### Probar la API Directamente:
```javascript
fetch('https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec?token=demo-token-2024&action=auth&email=admin@servesplatform.com&password=admin123')
  .then(response => response.json())
  .then(data => console.log('API Response:', data));
```

#### Verificar LocalStorage:
```javascript
console.log('Token guardado:', localStorage.getItem('token'));
console.log('Usuario guardado:', localStorage.getItem('user'));
```

#### Forzar Redirección:
```javascript
window.location.href = '/dashboard';
```

## 📊 RESULTADOS ESPERADOS

### Flujo Normal:
1. 🔐 Iniciando login...
2. 🔑 AuthContext iniciado
3. 🌐 APIClient enviando petición
4. 📡 Status 200 recibido
5. 📨 Respuesta con token y user
6. ✅ Login exitoso
7. 🎉 Redirección al dashboard

### Si hay problemas:
- ❌ Error en algún paso
- 🚨 Mensaje de error específico
- 📝 Detalles del problema en console

## 🔄 PRÓXIMOS PASOS SEGÚN RESULTADO

### Si el API funciona pero no redirige:
- Problema en el frontend
- Revisar código de redirección

### Si el API no responde:
- Problema con Google Apps Script
- Verificar despliegue del script

### Si hay errores de CORS:
- Problema de configuración
- Verificar permisos del script

## 📞 INFORMACIÓN PARA REPORTAR

Cuando hagas el debug, anota:
1. **Mensajes en Console** (copia y pega)
2. **Status de la petición Network** (200, 404, 500, etc.)
3. **Respuesta de la API** (JSON completo)
4. **Errores específicos** (si los hay)

Con esta información podremos identificar exactamente dónde está el problema y solucionarlo.

**¡Haz el debug y compárteme los resultados!** 🕵️‍♂️