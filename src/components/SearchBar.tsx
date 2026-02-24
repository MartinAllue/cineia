'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/tmdb'

interface SearchResult {
  id: number
  title: string
  poster_path: string | null
  release_date: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchMovies = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}&page=1`)
      const data = await res.json()
      setResults(data.results?.slice(0, 5) || [])
      setIsOpen(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchMovies(query)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, searchMovies])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.length >= 2) {
      setIsOpen(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (query.trim()) {
        router.push(`/explore?q=${encodeURIComponent(query)}`)
        setIsOpen(false)
      }
    }
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Buscar películas..."
          className="w-full bg-[#1a1a1a] text-white px-4 py-2 pl-10 rounded-lg border border-[#333] focus:border-red-500 focus:outline-none transition-colors"
          autoComplete="off"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              onClick={handleResultClick}
              className="flex items-center gap-3 p-3 hover:bg-[#2a2a2a] transition-colors cursor-pointer"
            >
              {movie.poster_path ? (
                <Image
                  src={getImageUrl(movie.poster_path, 'w185')}
                  alt={movie.title}
                  width={40}
                  height={60}
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-10 h-15 bg-[#2a2a2a] rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">N/A</span>
                </div>
              )}
              <div>
                <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                <p className="text-gray-500 text-xs">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </p>
              </div>
            </Link>
          ))}
          <Link
            href={`/explore?q=${encodeURIComponent(query)}`}
            onClick={handleResultClick}
            className="block p-3 text-center text-red-500 hover:bg-[#2a2a2a] border-t border-[#333] transition-colors"
          >
            Ver todos los resultados
          </Link>
        </div>
      )}
    </div>
  )
}
