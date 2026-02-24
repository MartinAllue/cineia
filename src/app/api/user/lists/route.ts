import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const lists = await prisma.userMovieList.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(lists)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener listas' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { movieId, status } = await request.json()

    if (!movieId || !status) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    const listItem = await prisma.userMovieList.upsert({
      where: {
        userId_movieId_status: {
          userId: session.user.id,
          movieId,
          status
        }
      },
      update: { status },
      create: {
        userId: session.user.id,
        movieId,
        status
      }
    })

    return NextResponse.json(listItem)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al guardar en lista' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const movieId = searchParams.get('movieId')
  const status = searchParams.get('status')

  if (!movieId || !status) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  try {
    await prisma.userMovieList.delete({
      where: {
        userId_movieId_status: {
          userId: session.user.id,
          movieId: parseInt(movieId),
          status
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar de lista' },
      { status: 500 }
    )
  }
}
