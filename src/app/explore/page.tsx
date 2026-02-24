'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import MovieCard from '@/components/MovieCard'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

interface MoviesResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Más Populares' },
  { value: 'vote_average.desc', label: 'Mejor Valoradas' },
  { value: 'release_date.desc', label: 'Más Recientes' },
  { value: 'revenue.desc', label: 'Mayores Recaudación' }
]

function ExploreContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const query = searchParams.get('q') || ''
  const genre = searchParams.get('genre') || ''
  const type = searchParams.get('type') || 'popular'
  const sortBy = searchParams.get('sort_by') || 'popularity.desc'
  const year = searchParams.get('year') || ''

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())

      if (query) {
        params.set('q', query)
      } else if (genre) {
        params.set('genre', genre)
      } else {
        params.set('type', type)
        if (sortBy) params.set('sort_by', sortBy)
      }

      if (year) params.set('year', year)

      const res = await fetch(`/api/movies/search?${params.toString()}`)
      const data: MoviesResponse = await res.json()

      setMovies(data.results || [])
      setTotalPages(data.total_pages || 0)
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }, [query, genre, type, sortBy, year, page])

  useEffect(() => {
    fetchMovies()
    window.scrollTo(0, 0)
  }, [fetchMovies])

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 shrink-0">
        <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Buscar</label>
            <input
              type="text"
              value={query}
              onChange={(e) => updateParams('q', e.target.value)}
              placeholder="Título..."
              className="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-[#333] focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => updateParams('sort_by', e.target.value)}
              className="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-[#333] focus:border-red-500 focus:outline-none"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Año</label>
            <input
              type="number"
              value={year}
              onChange={(e) => updateParams('year', e.target.value)}
              placeholder="2024"
              min="1900"
              max="2030"
              className="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-[#333] focus:border-red-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => router.push('/explore')}
            className="w-full text-gray-400 hover:text-white text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      </aside>

      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-lg aspect-[2/3] animate-pulse" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron películas</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#1a1a1a] text-white rounded disabled:opacity-50 hover:bg-[#2a2a2a] transition-colors"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-gray-400">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-[#1a1a1a] text-white rounded disabled:opacity-50 hover:bg-[#2a2a2a] transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Explorar Películas</h1>
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-lg aspect-[2/3] animate-pulse" />
          ))}
        </div>
      }>
        <ExploreContent />
      </Suspense>
    </div>
  )
}
