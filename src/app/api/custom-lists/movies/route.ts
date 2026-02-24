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
    const { listId, movieId, movieTitle, moviePoster } = await request.json()

    if (!listId || !movieId || !movieTitle) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const list = await prisma.customList.findUnique({ where: { id: listId } })

    if (!list || list.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const existingMovie = await prisma.customListMovie.findUnique({
      where: {
        listId_movieId: { listId, movieId }
      }
    })

    if (existingMovie) {
      return NextResponse.json({ error: 'La película ya está en la lista' }, { status: 400 })
    }

    const movie = await prisma.customListMovie.create({
      data: {
        listId,
        movieId,
        movieTitle,
        moviePoster: moviePoster || null
      }
    })

    await prisma.customList.update({
      where: { id: listId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(movie)
  } catch (error) {
    return NextResponse.json({ error: 'Error al añadir película' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const listId = searchParams.get('listId')
  const movieId = searchParams.get('movieId')

  if (!listId || !movieId) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  try {
    const list = await prisma.customList.findUnique({ where: { id: listId } })

    if (!list || list.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.customListMovie.delete({
      where: {
        listId_movieId: { listId, movieId: parseInt(movieId) }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al quitar película' }, { status: 500 })
  }
}
