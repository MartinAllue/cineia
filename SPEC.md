# CineIA - Proyecto de Valoración y Reviews de Películas

## 1. Project Overview

- **Nombre**: CineIA
- **Tipo**: Webapp completa (Next.js + API propia)
- **Funcionalidad**: Plataforma para explorar películas, valorarlas, escribir reviews y gestionar usuarios
- **Target**: Usuarios que buscan información y comunidad sobre cine

## 2. Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: API Routes de Next.js
- **Base de datos**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (credentials + Google OAuth)
- **Datos películas**: TMDB API
- **Estilo**: Dark mode con Tailwind CSS

## 3. UI/UX Specification

### Layout
- **Header**: Logo, navegación (Inicio, Películas, Mi Perfil), Search bar, Login/Logout
- **Main**: Grid de películas con pagination infinita
- **Footer**: Links, copyright

### Colores
- **Background**: `#0f0f0f` (principal), `#1a1a1a` (cards)
- **Primary**: `#e50914` (rojo NETFLIX-style)
- **Accent**: `#ffd700` (estrellas doradas)
- **Text**: `#ffffff` (principal), `#a0a0a0` (secundario)
- **Border**: `#333333`

### Components
- **MovieCard**: Poster, título, año, rating TMDB, rating usuario
- **RatingStars**: 5 estrellas interactivas
- **ReviewCard**: Usuario, fecha, rating, texto, likes
- **UserProfile**: Avatar, username, bio, listas (favoritos, vistas)
- **SearchBar**: Autocomplete con películas de TMDB

### Pages
1. **Home** (`/`): Películas populares/trending
2. **Película** (`/movie/[id]`): Detalles, cast, reviews, formulario de review
3. **Explorar** (`/explore`): Filtros (género, año, rating)
4. **Perfil** (`/profile`): Usuario logueado
5. **Auth** (`/login`, `/register`)

## 4. Funcionalidad

### Sistema de Usuarios
- Registro con email/password
- Login con Google OAuth
- Perfil editable (username, bio, avatar)
- Listas: "Quiero ver", "Vistas", "Favoritas"

### Sistema de Valoración
- Rating 1-5 estrellas (medio paso)
- Promedio de ratings de usuarios
- Mostrar rating TMDB + rating comunidad

### Sistema de Reviews
- Texto libre (mínimo 10 caracteres)
- Rating obligatorio
- Editar/borrar tus reviews
- Likes en reviews

### Datos Películas (TMDB)
- Fetch de: populares, trending, búsqueda, detalles, cast
- Cache de requests frecuentes

## 5. Database Schema

```prisma
User {
  id, email, password, name, image, bio
  createdAt, updatedAt
}

MovieRating {
  id, userId, movieId, rating (1-5)
  createdAt
}

Review {
  id, userId, movieId, content, rating
  likes, createdAt, updatedAt
}

Like {
  id, userId, reviewId
}

UserMovieList {
  id, userId, movieId, status (want_to_watch, watched, favorite)
  createdAt
}
```

## 6. API Endpoints

```
POST   /api/auth/register
POST   /api/auth/[...nextauth]
GET    /api/movies/popular
GET    /api/movies/search?q=
GET    /api/movies/[id]
POST   /api/ratings
GET    /api/ratings/[movieId]
POST   /api/reviews
GET    /api/reviews/[movieId]
PUT    /api/reviews/[id]
DELETE /api/reviews/[id]
POST   /api/reviews/[id]/like
GET    /api/user/lists
POST   /api/user/lists
```

## 7. Acceptance Criteria

- [ ] Usuario puede registrarse y hacer login
- [ ] Homepage muestra películas populares de TMDB
- [ ] Buscador funciona con autocomplete
- [ ] Página de película muestra detalles, cast y reviews
- [ ] Usuario puede valorar y escribir review
- [ ] Promedio de ratings se calcula correctamente
- [ ] Perfil muestra listas y reviews del usuario
- [ ] UI dark mode, responsive y fluida
