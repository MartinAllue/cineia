'use client'

import AddToListButton from './AddToListButton'

interface MovieActionsProps {
  movie: {
    id: number
    title: string
    poster_path: string | null
  }
}

export default function MovieActions({ movie }: MovieActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <AddToListButton movie={movie} />
    </div>
  )
}
