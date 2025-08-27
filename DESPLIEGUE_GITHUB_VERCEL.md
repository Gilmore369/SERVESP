# 🚀 DESPLIEGUE A GITHUB Y VERCEL - GUÍA PASO A PASO

## 📋 PREPARACIÓN PREVIA

### ✅ Estado Actual
- ✅ Google Apps Script funcionando
- ✅ Frontend Next.js funcionando localmente
- ✅ API integrada y probada
- ✅ Variables de entorno configuradas

## 🔧 PASO 1: PREPARAR EL PROYECTO PARA PRODUCCIÓN

### 1.1 Crear archivo .env.example
```bash
# Desde la carpeta serves-platform
cp .env.local .env.example
```

### 1.2 Limpiar .env.example (quitar valores sensibles)
Editar `.env.example` para que contenga solo las plantillas:
```env
# ServesPlatform Environment Variables

# API Configuration
NEXT_PUBLIC_API_BASE_URL=your_google_apps_script_url_here
NEXT_PUBLIC_API_TOKEN=your_api_token_here

# App Configuration
NEXT_PUBLIC_APP_NAME=ServesPlatform
NEXT_PUBLIC_APP_VERSION=1.0.0

# Environment
NODE_ENV=production
```

### 1.3 Verificar .gitignore
Asegurar que `.env.local` esté en `.gitignore`:
```gitignore
# Environment variables
.env.local
.env.production
.env
```

## 📦 PASO 2: SUBIR A GITHUB

### 2.1 Inicializar Git (si no está inicializado)
```bash
cd serves-platform
git init
git add .
git commit -m "Initial commit - ServesPlatform funcionando"
```

### 2.2 Crear Repositorio en GitHub
1. Ve a [github.com](https://github.com)
2. Haz clic en "New repository"
3. Nombre: `serves-platform`
4. Descripción: `Plataforma de gestión de proyectos de construcción`
5. Público o Privado (tu elección)
6. **NO** inicializar con README (ya tienes archivos)
7. Haz clic en "Create repository"

### 2.3 Conectar y Subir
```bash
# Agregar el repositorio remoto (reemplaza USERNAME con tu usuario de GitHub)
git remote add origin https://github.com/USERNAME/serves-platform.git

# Subir el código
git branch -M main
git push -u origin main
```

## 🌐 PASO 3: DESPLEGAR EN VERCEL

### 3.1 Conectar GitHub con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign up" o "Log in"
3. Conecta con tu cuenta de GitHub
4. Autoriza a Vercel para acceder a tus repositorios

### 3.2 Importar Proyecto
1. En el dashboard de Vercel, haz clic en "New Project"
2. Busca y selecciona `serves-platform`
3. Haz clic en "Import"

### 3.3 Configurar Variables de Entorno
1. En la sección "Environment Variables":
   ```
   NEXT_PUBLIC_API_BASE_URL = https://script.google.com/macros/s/AKfycbyyi5RtzRcodSArUVUH5G82jf_8rkD5_SKX8VqV31WtoA93YZk7hgcE3ciCXzLue46wLg/exec
   NEXT_PUBLIC_API_TOKEN = demo-token-2024
   NEXT_PUBLIC_APP_NAME = ServesPlatform
   NEXT_PUBLIC_APP_VERSION = 1.0.0
   NODE_ENV = production
   ```

### 3.4 Configurar Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `serves-platform`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3.5 Desplegar
1. Haz clic en "Deploy"
2. Espera a que termine el build (2-5 minutos)
3. ¡Tu aplicación estará disponible en una URL como `https://serves-platform-xxx.vercel.app`!

## 🔄 PASO 4: CONFIGURAR DESPLIEGUE AUTOMÁTICO

### 4.1 Configuración Automática
Vercel automáticamente:
- ✅ Despliega cada push a `main`
- ✅ Crea previews para pull requests
- ✅ Optimiza el build para producción

### 4.2 Dominios Personalizados (Opcional)
1. En el dashboard del proyecto en Vercel
2. Ve a "Settings" → "Domains"
3. Agrega tu dominio personalizado

## 🧪 PASO 5: VERIFICAR DESPLIEGUE

### 5.1 Probar la Aplicación
1. Ve a tu URL de Vercel
2. Verifica que cargue correctamente
3. Prueba la página de materiales
4. Confirma que la API responde

### 5.2 Verificar Variables de Entorno
En la consola del navegador, verifica:
```javascript
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
```

## 🔧 COMANDOS RÁPIDOS

### Para actualizar el proyecto:
```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de los cambios"
git push origin main
# Vercel desplegará automáticamente
```

### Para rollback:
```bash
# En Vercel dashboard → Deployments → Promote to Production
```

## 📊 MONITOREO Y LOGS

### En Vercel Dashboard:
- **Functions**: Ver logs de las funciones
- **Analytics**: Métricas de uso
- **Speed Insights**: Performance
- **Deployments**: Historial de despliegues

## 🚨 SOLUCIÓN DE PROBLEMAS COMUNES

### Error de Build:
1. Verificar que todas las dependencias estén en `package.json`
2. Revisar los logs de build en Vercel
3. Probar `npm run build` localmente

### Error de Variables de Entorno:
1. Verificar que estén configuradas en Vercel
2. Asegurar que empiecen con `NEXT_PUBLIC_`
3. Redesplegar después de cambiar variables

### Error de API:
1. Verificar que Google Apps Script esté desplegado
2. Probar la URL de API directamente
3. Verificar CORS en Google Apps Script

## ✅ CHECKLIST FINAL

- [ ] Código subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Aplicación funcionando en producción
- [ ] API respondiendo correctamente
- [ ] Páginas cargando sin errores

¡Tu aplicación ServesPlatform estará disponible 24/7 en internet! 🌐