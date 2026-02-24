# CineIA - Proyecto de Valoración y Reviews de Películas

Una aplicación web completa para explorar películas, valorarlas, escribir reseñas y crear listas personalizadas.

## Características

- 🔍 **Explorar películas** - Busca y filtra por género, año, rating
- ⭐ **Sistema de valoración** - Valora películas del 1 al 5
- 📝 **Reviews** - Escribe y lee reseñas de otros usuarios
- ❤️ **Listas personalizadas** - Crea tus propias listas de películas
- 👤 **Sistema de usuarios** - Registro y login con email

## Tecnologías

- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js
- **Datos**: The Movie Database (TMDB) API

## Requisitos

- Node.js 18+
- PostgreSQL

## Instalación

1. **Clona el repositorio**:
```bash
git clone https://github.com/MartinAllue/cineia.git
cd cineia
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Configura las variables de entorno**:
Crea un archivo `.env` con:
```
DATABASE_URL="postgresql://user:password@localhost:5432/cineia"
NEXTAUTH_SECRET="tu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
TMDB_API_KEY="tu-api-key-de-tmdb"
```

Para obtener una API key de TMDB:
1. Ve a https://www.themoviedb.org/settings/api
2. Crea una cuenta si no tienes
3. Solicita una API key (es gratuita)

4. **Configura la base de datos**:
```bash
npx prisma migrate dev --name init
```

5. **Inicia el servidor**:
```bash
npm run dev
```

6. Abre http://localhost:3000

## Uso

1. **Regístrate** en la página de login
2. **Explora** películas en la home o usa el buscador
3. **Valora** películas en su página detalle
4. **Escribe reviews** compartiendo tu opinión
5. **Crea listas** para guardar películas

## Autor

MartinAllue
