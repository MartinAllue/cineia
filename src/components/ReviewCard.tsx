'use client'

import { useState } from 'react'
import Image from 'next/image'
import RatingStars from './RatingStars'
import { getImageUrl } from '@/lib/tmdb'
import { useSession } from 'next-auth/react'

interface ReviewCardProps {
  review: {
    id: string
    content: string
    rating: number
    likes: number
    createdAt: string
    user: {
      id: string
      name: string | null
      image: string | null
    }
  }
  onLike?: (reviewId: string) => void
  userLiked?: boolean
}

export default function ReviewCard({ review, onLike, userLiked }: ReviewCardProps) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(userLiked || false)
  const [likesCount, setLikesCount] = useState(review.likes)

  const handleLike = async () => {
    if (!session) return

    try {
      await fetch(`/api/reviews/${review.id}/like`, { method: 'POST' })
      setLiked(!liked)
      setLikesCount(liked ? likesCount - 1 : likesCount + 1)
      onLike?.(review.id)
    } catch (error) {
      console.error('Error liking review:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-medium shrink-0">
          {review.user.name?.[0] || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-medium">
              {review.user.name || 'Usuario anónimo'}
            </span>
            <span className="text-gray-500 text-sm">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <div className="mt-1">
            <RatingStars rating={review.rating} readonly size="sm" />
          </div>
          <p className="text-gray-300 mt-2 whitespace-pre-wrap">{review.content}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 border-t border-[#333] pt-3">
        <button
          onClick={handleLike}
          disabled={!session}
          className={`flex items-center gap-1 text-sm transition-colors ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-white'
          } ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg
            className="w-5 h-5"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likesCount}</span>
        </button>
      </div>
    </div>
  )
}
