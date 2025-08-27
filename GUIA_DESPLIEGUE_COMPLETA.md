# Guía Completa de Despliegue - ServesPlatform

## 📋 Requisitos Previos

- Cuenta de Google (Gmail)
- Node.js instalado en tu computadora
- Navegador web (Chrome recomendado)

---

## 🚀 PARTE 1: Configurar Backend (Google Apps Script)

### Paso 1: Crear proyecto en Google Apps Script

1. Ve a [script.google.com](https://script.google.com)
2. Haz clic en **"Proyecto nuevo"**
3. Cambia el nombre del proyecto a: **"ServesPlatform_Backend"**

### Paso 2: Agregar archivos del backend

1. **Reemplazar Code.gs:**

   - Borra todo el contenido del archivo `Code.gs` por defecto
   - Copia y pega el contenido del archivo `google-apps-script/Code.gs`

2. **Agregar Auth.gs:**

   - Haz clic en el **"+"** junto a "Archivos"
   - Selecciona **"Script"**
   - Nómbralo **"Auth"**
   - Copia y pega el contenido del archivo `google-apps-script/Auth.gs`

3. **Agregar CRUD.gs:**

   - Haz clic en el **"+"** junto a "Archivos"
   - Selecciona **"Script"**
   - Nómbralo **"CRUD"**
   - Copia y pega el contenido del archivo `google-apps-script/CRUD.gs`

4. **Agregar Database.gs:**
   - Haz clic en el **"+"** junto a "Archivos"
   - Selecciona **"Script"**
   - Nómbralo **"Database"**
   - Copia y pega el contenido del archivo `google-apps-script/Database.gs`

### Paso 3: Crear la base de datos

1. En el editor de Apps Script, busca el dropdown de funciones
2. Selecciona **"setupDatabase"**
3. Haz clic en **"Ejecutar"** (▶️)
4. **IMPORTANTE:** Autoriza todos los permisos que te pida Google
5. Espera a que termine (puede tomar 1-2 minutos)
6. En el log verás algo como:
   ```
   Created spreadsheet with ID: 1ABC123...XYZ
   Spreadsheet URL: https://docs.google.com/spreadsheets/d/1ABC123...XYZ/edit
   ```
7. **COPIA Y GUARDA EL ID** (la parte entre `/d/` y `/edit`)

### Paso 4: Configurar propiedades del script

1. Haz clic en el ícono de **engranaje** (Configuración del proyecto)
2. Baja hasta **"Propiedades del script"**
3. Haz clic en **"Agregar propiedad del script"** y agrega estas 4 propiedades:

   | Propiedad     | Valor                              |
   | ------------- | ---------------------------------- |
   | `SHEET_ID`    | [El ID que copiaste en el paso 3]  |
   | `API_TOKEN`   | `demo-token-2024`                  |
   | `JWT_SECRET`  | `mi-secreto-jwt-super-seguro-2024` |
   | `ENVIRONMENT` | `development`                      |

### Paso 5: Desplegar como aplicación web

1. Haz clic en **"Implementar"** > **"Nueva implementación"**
2. Junto a "Tipo", haz clic en el ícono de engranaje
3. Selecciona **"Aplicación web"**
4. Configura:
   - **Descripción:** "ServesPlatform API"
   - **Ejecutar como:** "Yo"
   - **Quién tiene acceso:** "Cualquier persona"
5. Haz clic en **"Implementar"**
6. **COPIA Y GUARDA LA URL** que aparece (algo como: `https://script.google.com/macros/s/ABC123.../exec`)

---

## 💻 PARTE 2: Configurar Frontend (Next.js)

### Paso 6: Configurar variables de entorno

1. Abre el archivo `serves-platform/.env.local`
2. Reemplaza `[PEGA_AQUI_LA_URL_DE_TU_WEB_APP]` con la URL que copiaste en el Paso 5
3. Reemplaza `tu-token-seguro-aqui` con `demo-token-2024`
4. El archivo debe quedar así:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
   NEXT_PUBLIC_API_TOKEN=demo-token-2024
   NEXT_PUBLIC_APP_NAME=ServesPlatform
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NODE_ENV=development
   ```

### Paso 7: Instalar dependencias y ejecutar

1. Abre la terminal/cmd en la carpeta del proyecto
2. Navega a la carpeta del frontend:
   ```bash
   cd serves-platform
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Ejecuta la aplicación:
   ```bash
   npm run dev
   ```
5. Abre tu navegador en: `http://localhost:3000`

---

## 🔐 PARTE 3: Probar el Sistema

### Credenciales de Demo

- **Email:** `admin@servesplatform.com`
- **Contraseña:** `admin123`
- **Rol:** Administrador Líder

### Verificar que todo funciona

1. Ve a `http://localhost:3000`
2. Ingresa las credenciales de demo
3. Deberías ver el dashboard principal

---

## 🚀 PARTE 4: Despliegue en Producción (Opcional)

### Opción A: Vercel (Recomendado)

1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el proyecto desde GitHub
4. Configura las variables de entorno en Vercel:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_API_TOKEN`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_VERSION`
5. Despliega

### Opción B: Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `serves-platform` al área de despliegue
3. Configura las variables de entorno

---

## 🔧 Solución de Problemas

### Error: "Invalid API token"

- Verifica que el `API_TOKEN` en Google Apps Script sea igual al `NEXT_PUBLIC_API_TOKEN`

### Error: "CORS"

- Asegúrate de que el Google Apps Script esté desplegado como "Aplicación web"
- Verifica que "Quién tiene acceso" esté en "Cualquier persona"

### Error: "Cannot connect to API"

- Verifica que la URL en `.env.local` sea correcta
- Asegúrate de que termine en `/exec`

### La página no carga

- Verifica que Node.js esté instalado
- Ejecuta `npm install` nuevamente
- Verifica que el puerto 3000 no esté ocupado

---

## 📞 Soporte

Si tienes problemas, verifica:

1. Que todos los archivos estén copiados correctamente
2. Que las propiedades del script estén configuradas
3. Que la aplicación web esté desplegada
4. Que las variables de entorno estén correctas

¡Listo! Ya tienes ServesPlatform funcionando completamente.
