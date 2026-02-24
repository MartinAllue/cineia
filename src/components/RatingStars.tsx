'use client'

import { useState } from 'react'

interface RatingStarsProps {
  rating: number
  onRate?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function RatingStars({ rating, onRate, readonly = false, size = 'md' }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  }

  const handleClick = (value: number) => {
    if (!readonly && onRate) {
      onRate(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <svg
            className={`${sizes[size]} ${
              star <= (hoverRating || rating)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-600'
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={star <= (hoverRating || rating) ? 0 : 1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-gray-400 text-sm">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
