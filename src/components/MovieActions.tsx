'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface MovieInfo {
  id: number
  title: string
  poster_path: string | null
}

interface MovieListItem {
  movieId: number
  status: string
}

export default function MovieActions({ movie }: { movie: MovieInfo }) {
  const { data: session, status } = useSession()
  const [userLists, setUserLists] = useState<MovieListItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchUserLists()
    }
  }, [session])

  const fetchUserLists = async () => {
    try {
      const res = await fetch('/api/user/lists')
      const data = await res.json()
      setUserLists(data)
    } catch (error) {
      console.error('Error fetching user lists:', error)
    }
  }

  const addToList = async (status: string) => {
    if (!session) return
    setLoading(true)
    try {
      await fetch('/api/user/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: movie.id, status })
      })
      fetchUserLists()
    } catch (error) {
      console.error('Error adding to list:', error)
    } finally {
      setLoading(false)
    }
  }

  const isInList = (status: string) => {
    return userLists.some(l => l.movieId === movie.id && l.status === status)
  }

  if (status === 'loading') {
    return <div className="flex flex-wrap gap-3">
      <div className="w-32 h-10 bg-[#333] rounded-lg animate-pulse"></div>
      <div className="w-32 h-10 bg-[#333] rounded-lg animate-pulse"></div>
      <div className="w-32 h-10 bg-[#333] rounded-lg animate-pulse"></div>
    </div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => addToList('FAVORITE')}
        disabled={loading}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          isInList('FAVORITE')
            ? 'bg-red-500 text-white'
            : 'bg-[#333] hover:bg-[#444] text-white'
        }`}
      >
        <svg className="w-5 h-5" fill={isInList('FAVORITE') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {isInList('FAVORITE') ? 'Favorita' : 'Favorita'}
      </button>

      <button
        onClick={() => addToList('WANT_TO_WATCH')}
        disabled={loading}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          isInList('WANT_TO_WATCH')
            ? 'bg-blue-500 text-white'
            : 'bg-[#333] hover:bg-[#444] text-white'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {isInList('WANT_TO_WATCH') ? 'Quiero ver' : 'Quiero ver'}
      </button>

      <button
        onClick={() => addToList('WATCHED')}
        disabled={loading}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          isInList('WATCHED')
            ? 'bg-green-500 text-white'
            : 'bg-[#333] hover:bg-[#444] text-white'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {isInList('WATCHED') ? 'Vista' : 'Marcar vista'}
      </button>
    </div>
  )
}
