# CineIA - Proyecto de Películas

Aplicación web para explorar películas, valorarlas, escribir reseñas y crear listas personalizadas.

---

## Cómo ejecutar el proyecto (PASO A PASO)

### Paso 1: Instalar Node.js
Si no tienes Node.js, descárgalo desde: https://nodejs.org (versión LTS)

### Paso 2: Descargar el proyecto
Abre una terminal y ejecuta:
```bash
git clone https://github.com/MartinAllue/cineia.git
cd cineia
```

### Paso 3: Instalar dependencias
En la carpeta del proyecto, ejecuta:
```bash
npm install
```

### Paso 4: Obtener API Key de TMDB (GRATIS)
1. Ve a: https://www.themoviedb.org/settings/api
2. Crea una cuenta (es gratis)
3. Solicita una API key
4. Copia la API key que te dan

### Paso 5: Configurar archivo .env
1. En la carpeta del proyecto, crea un archivo llamado `.env`
2. Copia y pega esto (sustituye los valores):

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="una-clave-secreta-cualquiera-muy-larga"
NEXTAUTH_URL="http://localhost:3000"
TMDB_API_KEY="AQUI_TU_API_KEY_DE_TMDB"
```

**IMPORTANTE**: En `TMDB_API_KEY=` pon tu API key del paso 4.

### Paso 6: Configurar base de datos
En la terminal, ejecuta:
```bash
npx prisma migrate dev --name init
```

### Paso 7: Iniciar el proyecto
Ejecuta:
```bash
npm run dev
```

### Paso 8: Abrir en el navegador
Ve a: http://localhost:3000

---

## Funcionalidades

- Ver películas populares, top rated y en cartelera
- Buscar películas por título
- Valorar películas (1-5 estrellas)
- Escribir reseñas
- Crear listas personalizadas de películas
- Registro e inicio de sesión

---

## Problemas comunes

**Error al conectar con la base de datos:**
- Asegúrate de haber ejecutado `npx prisma migrate dev --name init`

**Error de TMDB:**
- Verifica que tu API key esté bien puesta en el archivo .env

**Puerto en uso:**
- Cierra otras aplicaciones que usen el puerto 3000

---

## Tecnologías usadas

- Next.js 14 (React)
- Tailwind CSS
- Prisma (base de datos)
- NextAuth (autenticación)
- TMDB API (datos de películas)

---

## Autor

Proyecto creado por MartinAllue
