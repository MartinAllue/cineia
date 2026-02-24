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
    const { movieId, content, rating } = await request.json()

    if (!movieId || !content || content.length < 10) {
      return NextResponse.json(
        { error: 'La review debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating inválido' },
        { status: 400 }
      )
    }

    const review = await prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId
        }
      },
      update: { content, rating },
      create: {
        userId: session.user.id,
        movieId,
        content,
        rating
      },
      include: {
        user: { select: { id: true, name: true, image: true } }
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al guardar review' },
      { status: 500 }
    )
  }
}
