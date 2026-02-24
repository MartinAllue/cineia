'use client'

import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface ListMovie {
  id: string
  movieId: number
  movieTitle: string
  moviePoster: string | null
  addedAt: string
}

interface CustomList {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  user: {
    id: string
    name: string | null
  }
  movies: ListMovie[]
}

export default function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [list, setList] = useState<CustomList | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editPublic, setEditPublic] = useState(false)

  useEffect(() => {
    fetchList()
  }, [id, session])

  const fetchList = async () => {
    try {
      const res = await fetch(`/api/custom-lists/${id}`)
      if (!res.ok) {
        router.push('/lists')
        return
      }
      const data = await res.json()
      setList(data)
      setEditName(data.name)
      setEditDesc(data.description || '')
      setEditPublic(data.isPublic)
      
      if (session?.user) {
        const userRes = await fetch('/api/custom-lists')
        const userLists = await userRes.json()
        setIsOwner(userLists.some((l: CustomList) => l.id === id))
      }
    } catch (error) {
      console.error('Error fetching list:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeMovie = async (movieId: number) => {
    if (!confirm('¿Quitar esta película de la lista?')) return

    try {
      const res = await fetch(`/api/custom-lists/movies?listId=${id}&movieId=${movieId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setList(list ? {
          ...list,
          movies: list.movies.filter(m => m.movieId !== movieId)
        } : null)
      }
    } catch (error) {
      console.error('Error removing movie:', error)
    }
  }

  const updateList = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/custom-lists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          isPublic: editPublic
        })
      })
      if (res.ok) {
        setList(list ? { ...list, name: editName, description: editDesc, isPublic: editPublic } : null)
        setShowEditModal(false)
      }
    } catch (error) {
      console.error('Error updating list:', error)
    }
  }

  const deleteList = async () => {
    if (!confirm('¿Eliminar esta lista permanentemente?')) return
    try {
      const res = await fetch(`/api/custom-lists/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/lists')
      }
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-[#1a1a1a] rounded w-64 mb-4"></div>
          <div className="h-4 bg-[#1a1a1a] rounded w-96 mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-72 bg-[#1a1a1a] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
          <p className="text-gray-400">Lista no encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{list.name}</h1>
            {list.description && (
              <p className="text-gray-400 mt-2">{list.description}</p>
            )}
            <p className="text-gray-500 text-sm mt-2">
              Creada por {list.user.name}
              {list.isPublic ? ' • Lista pública' : ' • Lista privada'}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Editar
              </button>
              <button
                onClick={deleteList}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {list.movies.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">Esta lista está vacía</p>
          {isOwner && (
            <Link href="/explore" className="text-red-500 hover:underline">
              Explorar películas para añadir
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {list.movies.map((movie) => (
            <div key={movie.id} className="relative group">
              <Link href={`/movie/${movie.movieId}`}>
                <div className="bg-[#1a1a1a] rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                  {movie.moviePoster ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.moviePoster}`}
                      alt={movie.movieTitle}
                      width={200}
                      height={300}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-[#2a2a2a] flex items-center justify-center">
                      <span className="text-gray-500">Sin póster</span>
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-white text-sm truncate">{movie.movieTitle}</p>
                  </div>
                </div>
              </Link>
              {isOwner && (
                <button
                  onClick={() => removeMovie(movie.movieId)}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                  title="Quitar de la lista"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Editar Lista</h2>
            <form onSubmit={updateList}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-[#333] focus:border-red-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Descripción</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-[#333] focus:border-red-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={editPublic}
                  onChange={(e) => setEditPublic(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="isPublic" className="text-gray-400 text-sm">
                  Hacer esta lista pública
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-[#333] text-white py-2 rounded-lg hover:bg-[#444] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
