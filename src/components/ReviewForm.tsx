'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import RatingStars from './RatingStars'

interface ReviewFormProps {
  movieId: number
  initialReview?: {
    content: string
    rating: number
  }
}

export default function ReviewForm({ movieId, initialReview }: ReviewFormProps) {
  const { data: session, status } = useSession()
  const [content, setContent] = useState(initialReview?.content || '')
  const [rating, setRating] = useState(initialReview?.rating || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (status === 'loading') {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-6">
        <div className="animate-pulse flex gap-4">
          <div className="w-10 h-10 bg-[#2a2a2a] rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-[#2a2a2a] rounded w-1/4 mb-4" />
            <div className="h-20 bg-[#2a2a2a] rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
        <p className="text-gray-400">
          <a href="/login" className="text-red-500 hover:underline">Inicia sesión</a> para escribir una review
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (content.length < 10) {
      setError('La review debe tener al menos 10 caracteres')
      return
    }

    if (rating === 0) {
      setError('Selecciona una valoración')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, content, rating })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar review')
      }

      setSuccess(true)
      setContent('')
      setRating(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Tu valoración</label>
          <RatingStars rating={rating} onRate={setRating} size="lg" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Tu review</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu opinión sobre la película..."
            className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-red-500 focus:outline-none transition-colors resize-none"
            rows={4}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm mb-4">¡Review guardada correctamente!</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Guardando...' : 'Publicar Review'}
        </button>
      </form>
    </div>
  )
}
