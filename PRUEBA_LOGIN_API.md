# Prueba de Login API - Diagnóstico

## URL de la API
```
https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec
```

## Credenciales Configuradas en Google Apps Script
- **Email**: `admin@servesplatform.com`
- **Password**: `admin123`
- **Token**: `demo-token-2024`

## URL de Prueba Completa
```
https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec?token=demo-token-2024&action=auth&email=admin@servesplatform.com&password=admin123
```

## Pasos para Diagnosticar

### 1. Probar la URL directamente en el navegador
Copia y pega la URL completa arriba en tu navegador. Deberías ver una respuesta JSON como:

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "1",
      "email": "admin@servesplatform.com",
      "nombre": "Administrador",
      "rol": "admin",
      "activo": true
    },
    "token": "mock-jwt-token-1735315200000",
    "message": "Login exitoso"
  },
  "timestamp": "2025-08-27T..."
}
```

### 2. Si la URL no funciona
- Verifica que el Google Apps Script esté desplegado correctamente
- Asegúrate de que los permisos estén configurados para "Anyone"

### 3. Si la URL funciona pero el frontend no
- Problema en el código del frontend
- Posible problema de CORS
- Variables de entorno incorrectas

## Posibles Problemas y Soluciones

### Problema 1: Google Apps Script no desplegado
**Solución**: 
1. Ve a https://script.google.com
2. Abre tu proyecto
3. Haz clic en "Deploy" > "New deployment"
4. Tipo: "Web app"
5. Execute as: "Me"
6. Who has access: "Anyone"

### Problema 2: Variables de entorno incorrectas en Vercel
**Solución**:
1. Ve a Vercel Dashboard
2. Selecciona tu proyecto
3. Ve a Settings > Environment Variables
4. Verifica que estén configuradas correctamente

### Problema 3: CORS o problemas de red
**Solución**:
- El Google Apps Script debería manejar CORS automáticamente
- Verificar que la URL sea exactamente la correcta

## Comandos para Probar Localmente

```bash
# En la carpeta serves-platform
npm run dev

# Luego ve a http://localhost:3000/login
# E intenta hacer login con:
# Email: admin@servesplatform.com
# Password: admin123
```

## Verificar en Consola del Navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Intenta hacer login
4. Busca la petición a la API de Google Apps Script
5. Verifica la respuesta

## Próximos Pasos

1. **Probar URL directamente** - Si funciona, el problema está en el frontend
2. **Verificar variables de entorno** - Tanto local como en Vercel
3. **Revisar logs de Google Apps Script** - Para ver si llegan las peticiones
4. **Verificar código de autenticación** - En el frontend

## Credenciales de Prueba Confirmadas

- ✅ Email: `admin@servesplatform.com`
- ✅ Password: `admin123`
- ✅ Token API: `demo-token-2024`
- ✅ Google Apps Script configurado correctamente