'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/tmdb'

interface MovieCardProps {
  movie: {
    id: number
    title: string
    poster_path: string | null
    release_date: string
    vote_average: number
  }
}

export default function MovieCard({ movie }: MovieCardProps) {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'

  return (
    <Link href={`/movie/${movie.id}`} className="group">
      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-red-500/20">
        <div className="relative aspect-[2/3]">
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
              <span className="text-gray-500">Sin póster</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white text-sm font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-white font-medium text-sm truncate group-hover:text-red-500 transition-colors">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-xs mt-1">{year}</p>
        </div>
      </div>
    </Link>
  )
}
