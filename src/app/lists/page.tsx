'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface CustomList {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  movies: {
    movieId: number
    movieTitle: string
    moviePoster: string | null
  }[]
}

export default function ListsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [lists, setLists] = useState<CustomList[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDesc, setNewListDesc] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session) {
      fetchLists()
    }
  }, [session, status])

  const fetchLists = async () => {
    try {
      const res = await fetch('/api/custom-lists')
      const data = await res.json()
      setLists(data)
    } catch (error) {
      console.error('Error fetching lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const createList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/custom-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName, description: newListDesc })
      })

      if (res.ok) {
        const newList = await res.json()
        setLists([newList, ...lists])
        setShowModal(false)
        setNewListName('')
        setNewListDesc('')
      }
    } catch (error) {
      console.error('Error creating list:', error)
    } finally {
      setCreating(false)
    }
  }

  const deleteList = async (listId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta lista?')) return

    try {
      const res = await fetch(`/api/custom-lists/${listId}`, { method: 'DELETE' })
      if (res.ok) {
        setLists(lists.filter(l => l.id !== listId))
      }
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-[#1a1a1a] rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-[#1a1a1a] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
          <p className="text-gray-400">Inicia sesión para ver tus listas</p>
          <Link href="/login" className="text-red-500 hover:underline mt-2 inline-block">
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Mis Listas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Lista
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-[#1a1a1a] rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : lists.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No tienes ninguna lista todavía</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:underline"
          >
            Crear tu primera lista
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <div key={list.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden">
              <Link href={`/lists/${list.id}`}>
                <div className="h-32 bg-gradient-to-br from-red-600/30 to-purple-600/30 flex items-center justify-center">
                  {list.movies.length > 0 ? (
                    <div className="flex gap-1">
                      {list.movies.slice(0, 3).map((m, i) => (
                        <div key={i} className="w-16 h-24 bg-[#2a2a2a] rounded overflow-hidden">
                          {m.moviePoster ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${m.moviePoster}`}
                              alt={m.movieTitle}
                              width={64}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#333]"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <Link href={`/lists/${list.id}`}>
                    <h3 className="text-white font-bold hover:text-red-500 transition-colors">
                      {list.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => deleteList(list.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                {list.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{list.description}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  {list.movies.length} película{list.movies.length !== 1 ? 's' : ''}
                  {list.isPublic ? ' • Pública' : ' • Privada'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear lista */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Crear Nueva Lista</h2>
            <form onSubmit={createList}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Nombre de la lista</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  required
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-[#333] focus:border-red-500 focus:outline-none"
                  placeholder="Mis películas favoritas"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Descripción (opcional)</label>
                <textarea
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-[#333] focus:border-red-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Una descripción para tu lista..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#333] text-white py-2 rounded-lg hover:bg-[#444] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creando...' : 'Crear Lista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
