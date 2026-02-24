import axios from 'axios'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_API_URL = process.env.TMDB_API_URL || 'https://api.themoviedb.org/3'
const TMDB_IMAGE_URL = process.env.TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p'

const USE_MOCK_DATA = !TMDB_API_KEY || TMDB_API_KEY === 'YOUR_TMDB_API_KEY'

const mockMovies = [
  { id: 550, title: 'Fight Club', original_title: 'Fight Club', overview: 'A ticking-Loss explosive story of a modern working-class male.', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg', release_date: '1999-10-15', vote_average: 8.4, vote_count: 26000, popularity: 80, adult: false, genre_ids: [18, 53, 35], original_language: 'en' },
  { id: 238, title: 'The Godfather', original_title: 'The Godfather', overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg', release_date: '1972-03-14', vote_average: 8.7, vote_count: 18000, popularity: 120, adult: false, genre_ids: [18, 80], original_language: 'en' },
  { id: 424, title: "Schindler's List", original_title: "Schindler's List", overview: 'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives.', poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', backdrop_path: '/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg', release_date: '1993-12-15', vote_average: 8.6, vote_count: 14000, popularity: 60, adult: false, genre_ids: [18, 36, 10752], original_language: 'en' },
  { id: 155, title: 'The Dark Knight', original_title: 'The Dark Knight', overview: 'Batman raises the stakes in his war on crime.', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', backdrop_path: '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg', release_date: '2008-07-16', vote_average: 8.5, vote_count: 30000, popularity: 150, adult: false, genre_ids: [18, 28, 80], original_language: 'en' },
  { id: 680, title: 'Pulp Fiction', original_title: 'Pulp Fiction', overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll.', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', release_date: '1994-09-10', vote_average: 8.5, vote_count: 25000, popularity: 90, adult: false, genre_ids: [53, 80], original_language: 'en' },
  { id: 13, title: 'Forrest Gump', original_title: 'Forrest Gump', overview: 'A man with a low IQ has accomplished great things in his life.', poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', backdrop_path: '/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg', release_date: '1994-06-23', vote_average: 8.5, vote_count: 24000, popularity: 85, adult: false, genre_ids: [35, 18, 10749], original_language: 'en' },
  { id: 122, title: 'The Lord of the Rings: The Return of the King', original_title: 'The Lord of the Rings: The Return of the King', overview: 'Aragorn is revealed as the heir to the ancient kings.', poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', backdrop_path: '/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg', release_date: '2003-12-01', vote_average: 8.5, vote_count: 22000, popularity: 110, adult: false, genre_ids: [12, 14, 28], original_language: 'en' },
  { id: 27205, title: 'Inception', original_title: 'Inception', overview: 'A thief who steals corporate secrets through the use of dream-sharing technology.', poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Ber.jpg', backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', release_date: '2010-07-15', vote_average: 8.4, vote_count: 33000, popularity: 140, adult: false, genre_ids: [28, 878, 12], original_language: 'en' },
  { id: 497, title: 'The Green Mile', original_title: 'The Green Mile', overview: 'A supernatural tale set on death row in a Southern prison.', poster_path: '/velWPhVMQeQKcxggNEU8YmIo52R.jpg', backdrop_path: '/Adrip2Jqzw56KeuV2nAxucKMNXA.jpg', release_date: '1999-12-10', vote_average: 8.5, vote_count: 16000, popularity: 75, adult: false, genre_ids: [14, 18, 80], original_language: 'en' },
  { id: 389, title: '12 Angry Men', original_title: '12 Angry Men', overview: 'The defense and the prosecution have rested and the jury is filing into the jury room.', poster_path: '/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg', backdrop_path: '/qqHQsStV6exghCM7zbObuYBiYxw.jpg', release_date: '1957-04-10', vote_average: 8.5, vote_count: 7000, popularity: 45, adult: false, genre_ids: [18], original_language: 'en' }
]

export const getImageUrl = (path: string | null, size: 'w185' | 'w500' | 'original' = 'w500') => {
  if (!path) return '/placeholder.jpg'
  return `${TMDB_IMAGE_URL}/${size}${path}`
}

export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  genre_ids: number[]
  original_language: string
}

export interface MovieDetails extends Movie {
  runtime: number | null
  genres: { id: number; name: string }[]
  budget: number
  revenue: number
  status: string
  tagline: string | null
  production_companies: { id: number; name: string; logo_path: string | null }[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface MovieCredits {
  id: number
  cast: CastMember[]
  crew: { id: number; name: string; job: string; department: string }[]
}

const getMockMovies = (page = 1) => {
  const perPage = 10
  const start = (page - 1) * perPage
  const end = start + perPage
  return {
    page,
    results: mockMovies.slice(start, end),
    total_pages: 1,
    total_results: mockMovies.length
  }
}

const getMockMovieDetails = (id: number): MovieDetails | null => {
  const movie = mockMovies.find(m => m.id === id)
  if (!movie) return null
  return {
    ...movie,
    runtime: 120,
    genres: [
      { id: 18, name: 'Drama' },
      { id: 53, name: 'Thriller' }
    ],
    budget: 50000000,
    revenue: 150000000,
    status: 'Released',
    tagline: 'An unforgettable story',
    production_companies: []
  }
}

const getMockCredits = (id: number): MovieCredits => ({
  id,
  cast: [
    { id: 1, name: 'Actor Principal', character: 'Character', profile_path: null, order: 0 },
    { id: 2, name: 'Actor Secundario', character: 'Other Character', profile_path: null, order: 1 }
  ],
  crew: [
    { id: 3, name: 'Director Famoso', job: 'Director', department: 'Directing' }
  ]
})

export const getPopularMovies = async (page = 1) => {
  if (USE_MOCK_DATA) return getMockMovies(page)
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get('/movie/popular', { params: { page } })
  return data
}

export const getTrendingMovies = async (page = 1, timeWindow = 'week') => {
  if (USE_MOCK_DATA) return getMockMovies(page)
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get(`/trending/movie/${timeWindow}`, { params: { page } })
  return data
}

export const getTopRatedMovies = async (page = 1) => {
  if (USE_MOCK_DATA) return getMockMovies(page)
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get('/movie/top_rated', { params: { page } })
  return data
}

export const getNowPlayingMovies = async (page = 1) => {
  if (USE_MOCK_DATA) return getMockMovies(page)
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get('/movie/now_playing', { params: { page } })
  return data
}

export const searchMovies = async (query: string, page = 1) => {
  if (USE_MOCK_DATA) {
    const filtered = mockMovies.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase())
    )
    return { page: 1, results: filtered, total_pages: 1, total_results: filtered.length }
  }
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get('/search/movie', { params: { query, page } })
  return data
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  if (USE_MOCK_DATA) {
    const movie = getMockMovieDetails(id)
    if (!movie) throw new Error('Movie not found')
    return movie
  }
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get(`/movie/${id}`)
  return data
}

export const getMovieCredits = async (id: number): Promise<MovieCredits> => {
  if (USE_MOCK_DATA) return getMockCredits(id)
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get(`/movie/${id}/credits`)
  return data
}

export const getMovieGenres = async () => {
  if (USE_MOCK_DATA) {
    return { genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Acción' }, { id: 35, name: 'Comedia' }] }
  }
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get('/genre/movie/list')
  return data
}

export const getMoviesByGenre = async (genreId: number, page = 1, year?: string) => {
  if (USE_MOCK_DATA) return getMockMovies(page)
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const params: Record<string, string | number> = { with_genres: genreId, page }
  if (year) {
    params['release_date.gte'] = `${year}-01-01`
    params['release_date.lte'] = `${year}-12-31`
  }
  const { data } = await tmdb.get('/discover/movie', { params })
  return data
}

export const discoverMovies = async (params: {
  page?: number
  sort_by?: string
  with_genres?: number
  'release_date.gte'?: string
  'release_date.lte'?: string
  'vote_average.gte'?: number
  'vote_average.lte'?: number
  'vote_count.gte'?: number
}) => {
  if (USE_MOCK_DATA) return getMockMovies(params.page || 1)
  const tmdb = axios.create({ baseURL: TMDB_API_URL, params: { api_key: TMDB_API_KEY, language: 'es-ES' } })
  const { data } = await tmdb.get('/discover/movie', { params })
  return data
}
