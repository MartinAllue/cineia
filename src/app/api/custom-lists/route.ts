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
    const lists = await prisma.customList.findMany({
      where: { userId: session.user.id },
      include: {
        movies: {
          orderBy: { addedAt: 'desc' },
          take: 4
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(lists)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener listas' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { name, description, isPublic } = await request.json()

    if (!name || name.trim().length < 1) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }

    const list = await prisma.customList.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        description: description?.trim() || null,
        isPublic: isPublic || false
      }
    })

    return NextResponse.json(list)
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear lista' }, { status: 500 })
  }
}
