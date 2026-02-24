'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface MovieInfo {
  id: number
  title: string
  poster_path: string | null
}

interface CustomList {
  id: string
  name: string
  movies: { movieId: number }[]
}

export default function AddToListButton({ movie }: { movie: MovieInfo }) {
  const { data: session, status } = useSession()
  const [lists, setLists] = useState<CustomList[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showNewList, setShowNewList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchLists()
    }
  }, [session])

  const fetchLists = async () => {
    try {
      const res = await fetch('/api/custom-lists')
      const data = await res.json()
      setLists(data)
    } catch (error) {
      console.error('Error fetching lists:', error)
    }
  }

  const addToList = async (listId: string) => {
    try {
      const res = await fetch('/api/custom-lists/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId,
          movieId: movie.id,
          movieTitle: movie.title,
          moviePoster: movie.poster_path
        })
      })

      if (res.ok) {
        fetchLists()
        alert('Película añadida a la lista')
      } else {
        const data = await res.json()
        alert(data.error || 'Error al añadir')
      }
    } catch (error) {
      console.error('Error adding to list:', error)
    }
  }

  const createAndAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/custom-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName })
      })

      if (res.ok) {
        const newList = await res.json()
        await addToList(newList.id)
        setShowNewList(false)
        setNewListName('')
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error creating list:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="w-32 h-10 bg-[#333] rounded-lg animate-pulse"></div>
  }

  if (!session) {
    return null
  }

  const isInList = (listId: string) => {
    return lists.some(l => l.id === listId && l.movies.some(m => m.movieId === movie.id))
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Añadir a lista
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Añadir a lista</h2>
            
            {!showNewList ? (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {lists.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No tienes listas todavía</p>
                  ) : (
                    lists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => addToList(list.id)}
                        disabled={isInList(list.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          isInList(list.id)
                            ? 'bg-green-500/20 text-green-500 cursor-default'
                            : 'bg-[#2a2a2a] hover:bg-[#333] text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{list.name}</span>
                          {isInList(list.id) && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <button
                  onClick={() => setShowNewList(true)}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear nueva lista
                </button>
              </>
            ) : (
              <form onSubmit={createAndAdd}>
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Nombre de la lista</label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    required
                    autoFocus
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-[#333] focus:border-red-500 focus:outline-none"
                    placeholder="Mis favoritos..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewList(false)}
                    className="flex-1 bg-[#333] text-white py-2 rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creando...' : 'Crear y añadir'}
                  </button>
                </div>
              </form>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 text-gray-400 hover:text-white text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
