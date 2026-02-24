import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  try {
    const list = await prisma.customList.findUnique({
      where: { id },
      include: {
        movies: {
          orderBy: { addedAt: 'desc' }
        },
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    if (!list) {
      return NextResponse.json({ error: 'Lista no encontrada' }, { status: 404 })
    }

    if (!list.isPublic && list.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    return NextResponse.json(list)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener lista' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const list = await prisma.customList.findUnique({ where: { id } })

    if (!list || list.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { name, description, isPublic } = await request.json()

    const updated = await prisma.customList.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic })
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar lista' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const list = await prisma.customList.findUnique({ where: { id } })

    if (!list || list.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.customList.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar lista' }, { status: 500 })
  }
}
