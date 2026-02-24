import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id: reviewId } = await params

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id,
          reviewId
        }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
      await prisma.review.update({
        where: { id: reviewId },
        data: { likes: { decrement: 1 } }
      })
      return NextResponse.json({ liked: false })
    } else {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          reviewId
        }
      })
      await prisma.review.update({
        where: { id: reviewId },
        data: { likes: { increment: 1 } }
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al dar like' },
      { status: 500 }
    )
  }
}
