# 🚀 Guía Completa de Despliegue en Vercel

## 📋 PREPARACIÓN PREVIA

### 1. Verificar que Todo Funciona Localmente
```bash
cd serves-platform
npm run build
npm run start
```

### 2. Configurar Google Apps Script para Producción

#### A. Verificar Configuración
1. Ve a [script.google.com](https://script.google.com)
2. Abre tu proyecto ServesPlatform
3. Ve a **Configuración** > **Propiedades del script**
4. Verifica estas propiedades:

```
SHEET_ID: 1FYYgZONu04loEZOXzRz6GLIjzn-wAguQg4S_qHNri8U
API_TOKEN: demo-token-2024
JWT_SECRET: mi-secreto-jwt-super-seguro-2024
ENVIRONMENT: production
```

#### B. Desplegar como Aplicación Web
1. **Desplegar** > **Nueva implementación**
2. Configuración:
   - **Tipo**: Aplicación web
   - **Ejecutar como**: Yo
   - **Quién puede acceder**: Cualquier persona
3. **Copiar la URL generada** (ejemplo: `https://script.google.com/macros/s/ABC123.../exec`)

---

## 🌐 DESPLIEGUE EN VERCEL

### Método 1: Desde la Interfaz Web (Recomendado)

#### 1. Preparar el Repositorio
```bash
# Si no tienes Git inicializado
cd serves-platform
git init
git add .
git commit -m "Initial commit"

# Subir a GitHub
# Crear repositorio en GitHub y seguir las instrucciones
```

#### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. **Sign up** con tu cuenta de GitHub
3. **New Project**
4. **Import** tu repositorio
5. Configurar:
   - **Framework Preset**: Next.js
   - **Root Directory**: `serves-platform`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### 3. Configurar Variables de Entorno
En el dashboard de Vercel, ve a **Settings** > **Environment Variables**:

```env
NEXT_PUBLIC_API_BASE_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
NEXT_PUBLIC_API_TOKEN=demo-token-2024
NEXT_PUBLIC_APP_NAME=ServesPlatform
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

#### 4. Desplegar
1. Haz clic en **Deploy**
2. Espera a que termine el build
3. **¡Listo!** Tu app estará en `https://tu-proyecto.vercel.app`

### Método 2: Desde la Terminal

#### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

#### 2. Login y Configurar
```bash
cd serves-platform
vercel login
vercel
```

#### 3. Configurar Variables de Entorno
```bash
vercel env add NEXT_PUBLIC_API_BASE_URL
# Pegar tu URL de Google Apps Script

vercel env add NEXT_PUBLIC_API_TOKEN
# Pegar: demo-token-2024

vercel env add NEXT_PUBLIC_APP_NAME
# Pegar: ServesPlatform

vercel env add NEXT_PUBLIC_APP_VERSION
# Pegar: 1.0.0
```

#### 4. Desplegar a Producción
```bash
vercel --prod
```

---

## 🔧 CONFIGURACIÓN AVANZADA

### 1. Configurar Dominio Personalizado
1. En Vercel Dashboard > **Settings** > **Domains**
2. **Add Domain**
3. Seguir instrucciones para configurar DNS

### 2. Configurar Redirects (Opcional)
Crear `serves-platform/vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/dashboard",
      "permanent": false
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 3. Configurar Analytics (Opcional)
En `serves-platform/src/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔒 CONFIGURACIÓN DE SEGURIDAD

### 1. Configurar CORS en Google Apps Script
En `google-apps-script/Code.gs`, asegúrate de tener:

```javascript
function handleRequest(e) {
  // ... código existente ...
  
  // Configurar CORS para producción
  const allowedOrigins = [
    'https://tu-proyecto.vercel.app',
    'http://localhost:3000' // Para desarrollo
  ];
  
  // ... resto del código ...
}
```

### 2. Cambiar Token de Producción
1. Genera un token seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Actualiza en Google Apps Script y Vercel

### 3. Configurar Variables de Entorno por Ambiente
En Vercel, puedes configurar variables específicas para:
- **Production**
- **Preview** 
- **Development**

---

## 📊 MONITOREO Y LOGS

### 1. Ver Logs en Tiempo Real
```bash
vercel logs tu-proyecto.vercel.app
```

### 2. Configurar Alertas
1. Vercel Dashboard > **Settings** > **Integrations**
2. Conectar con Slack, Discord, etc.

### 3. Métricas de Performance
- Vercel automáticamente proporciona métricas
- Ve a **Analytics** en el dashboard

---

## 🚨 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "API request failed"
**Causa:** Google Apps Script no accesible
**Solución:**
1. Verificar que el script esté desplegado
2. Confirmar permisos del Google Sheet
3. Revisar variables de entorno

### Error: "Build failed"
**Causa:** Errores de TypeScript o dependencias
**Solución:**
```bash
# Verificar localmente
npm run build
npm run lint

# Revisar logs en Vercel
vercel logs
```

### Error: "Environment variables not found"
**Causa:** Variables no configuradas correctamente
**Solución:**
1. Verificar en Vercel Dashboard > Settings > Environment Variables
2. Asegurar que empiecen con `NEXT_PUBLIC_`
3. Redesplegar después de cambios

### Error de CORS
**Causa:** Google Apps Script bloquea el origen
**Solución:**
1. Verificar configuración de CORS en el script
2. Asegurar que el script esté desplegado como "aplicación web"
3. Confirmar permisos "Cualquier persona"

---

## ✅ CHECKLIST DE DESPLIEGUE

### Pre-despliegue
- [ ] App funciona localmente
- [ ] Google Apps Script configurado
- [ ] Google Sheet con permisos
- [ ] Variables de entorno preparadas

### Despliegue
- [ ] Repositorio en GitHub
- [ ] Proyecto creado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] App accesible

### Post-despliegue
- [ ] Probar todas las funcionalidades
- [ ] Verificar conexión con Google Sheets
- [ ] Probar en diferentes dispositivos
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar monitoreo

### Seguridad
- [ ] Token de producción seguro
- [ ] CORS configurado correctamente
- [ ] Headers de seguridad
- [ ] Acceso restringido si es necesario

---

## 🔄 ACTUALIZACIONES FUTURAS

### Despliegue Automático
Vercel automáticamente despliega cuando haces push a la rama principal.

### Despliegue Manual
```bash
# Desde la terminal
vercel --prod

# O desde el dashboard de Vercel
# Re-deploy desde la interfaz
```

### Rollback
```bash
# Ver deployments
vercel ls

# Hacer rollback
vercel rollback [deployment-url]
```

---

## 📞 SOPORTE

### Recursos Útiles
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Google Apps Script Docs](https://developers.google.com/apps-script)

### Comandos de Diagnóstico
```bash
# Verificar configuración
vercel env ls

# Ver logs
vercel logs

# Información del proyecto
vercel inspect
```

¿Necesitas ayuda con algún paso específico del despliegue?