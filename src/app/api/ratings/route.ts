import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { movieId, rating } = await request.json()

    if (!movieId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    const userRating = await prisma.movieRating.upsert({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId
        }
      },
      update: { rating },
      create: {
        userId: session.user.id,
        movieId,
        rating
      }
    })

    return NextResponse.json(userRating)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al guardar rating' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const movieId = searchParams.get('movieId')

  if (!movieId) {
    return NextResponse.json({ error: 'MovieId requerido' }, { status: 400 })
  }

  try {
    const ratings = await prisma.movieRating.findMany({
      where: { movieId: parseInt(movieId) },
      select: { rating: true }
    })

    const average = ratings.length > 0
      ? ratings.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / ratings.length
      : null

    return NextResponse.json({
      average,
      count: ratings.length,
      ratings
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener ratings' },
      { status: 500 }
    )
  }
}
