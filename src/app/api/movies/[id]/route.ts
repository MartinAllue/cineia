import { NextResponse } from 'next/server'
import { getMovieDetails, getMovieCredits } from '@/lib/tmdb'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const movieId = parseInt(id)

  if (isNaN(movieId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const [movie, credits, ratings, reviews] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      prisma.movieRating.aggregate({
        where: { movieId },
        _avg: { rating: true },
        _count: { rating: true }
      }),
      prisma.review.findMany({
        where: { movieId },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    const userRatings = await prisma.movieRating.findMany({
      where: { movieId },
      select: { rating: true }
    })

    const averageRating = userRatings.length > 0
      ? userRatings.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / userRatings.length
      : null

    return NextResponse.json({
      ...movie,
      communityRating: averageRating,
      ratingCount: ratings._count.rating,
      reviews
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener detalles de la película' },
      { status: 500 }
    )
  }
}
