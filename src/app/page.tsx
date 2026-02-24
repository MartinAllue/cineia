import MovieCard from '@/components/MovieCard'
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies } from '@/lib/tmdb'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

function MovieSection({ title, movies, linkHref, linkText }: { 
  title: string, 
  movies: Movie[], 
  linkHref: string, 
  linkText: string 
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link 
          href={linkHref}
          className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
        >
          {linkText} →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.slice(0, 10).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}

export default async function Home() {
  let popularData, topRatedData, nowPlayingData
  
  try {
    const [popular, topRated, nowPlaying] = await Promise.all([
      getPopularMovies(1),
      getTopRatedMovies(1),
      getNowPlayingMovies(1)
    ])
    popularData = popular
    topRatedData = topRated
    nowPlayingData = nowPlaying
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Configuración requerida</h2>
          <p className="text-gray-400 mb-4">
            Para usar CineIA, necesitas configurar tu API key de TMDB.
          </p>
          <p className="text-gray-500 text-sm">
            Edita el archivo <code className="bg-[#2a2a2a] px-2 py-1 rounded">.env</code> y añade tu TMDB_API_KEY.
          </p>
        </div>
      </div>
    )
  }

  if (!popularData?.results) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quick Access */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/explore?sort_by=vote_average.desc&min_votes=500"
            className="group bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 text-white hover:from-red-500 hover:to-red-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Top Rated</h3>
                <p className="text-red-100 text-sm">Mejores valoradas</p>
              </div>
            </div>
          </Link>
          
          <Link
            href="/explore?type=now_playing"
            className="group bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white hover:from-blue-500 hover:to-blue-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">En Cartelera</h3>
                <p className="text-blue-100 text-sm">Ahora en cines</p>
              </div>
            </div>
          </Link>
          
          <Link
            href="/explore"
            className="group bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white hover:from-purple-500 hover:to-purple-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Explorar</h3>
                <p className="text-purple-100 text-sm">Todas las películas</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <MovieSection 
        title="🔥 Tendencias" 
        movies={popularData.results} 
        linkHref="/explore"
        linkText="Ver todas"
      />

      <MovieSection 
        title="⭐ Top Rated" 
        movies={topRatedData?.results || []} 
        linkHref="/explore?sort_by=vote_average.desc&min_votes=500"
        linkText="Ver todas"
      />

      <MovieSection 
        title="🎬 En Cartelera" 
        movies={nowPlayingData?.results || []} 
        linkHref="/explore?type=now_playing"
        linkText="Ver todas"
      />
    </div>
  )
}
