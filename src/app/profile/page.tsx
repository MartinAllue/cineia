import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

type UserMovieList = {
  id: string
  userId: string
  movieId: number
  status: string
  createdAt: Date
}

type Review = {
  id: string
  userId: string
  movieId: number
  content: string
  rating: number
  likes: number
  createdAt: Date
  updatedAt: Date
  user: {
    name: string | null
    image: string | null
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [user, reviews, lists] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true, bio: true, createdAt: true }
    }),
    prisma.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true, image: true } }
      }
    }),
    prisma.userMovieList.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })
  ])

  if (!user) return null

  const favorites = lists.filter((l: UserMovieList) => l.status === 'FAVORITE')
  const wantToWatch = lists.filter((l: UserMovieList) => l.status === 'WANT_TO_WATCH')
  const watched = lists.filter((l: UserMovieList) => l.status === 'WATCHED')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {user.name?.[0] || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
            {user.bio && (
              <p className="text-gray-300 mt-2">{user.bio}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Favoritas ({favorites.length})
          </h2>
          {favorites.length === 0 ? (
            <p className="text-gray-400 text-sm">No tienes películas favoritas</p>
          ) : (
            <div className="space-y-2">
              {favorites.slice(0, 5).map((fav: UserMovieList) => (
                <Link
                  key={fav.id}
                  href={`/movie/${fav.movieId}`}
                  className="block text-gray-300 hover:text-red-500 text-sm truncate"
                >
                  ID: {fav.movieId}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Quiero Ver ({wantToWatch.length})
          </h2>
          {wantToWatch.length === 0 ? (
            <p className="text-gray-400 text-sm">No tienes películas en tu lista</p>
          ) : (
            <div className="space-y-2">
              {wantToWatch.slice(0, 5).map((item: UserMovieList) => (
                <Link
                  key={item.id}
                  href={`/movie/${item.movieId}`}
                  className="block text-gray-300 hover:text-red-500 text-sm truncate"
                >
                  ID: {item.movieId}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Vistas ({watched.length})
          </h2>
          {watched.length === 0 ? (
            <p className="text-gray-400 text-sm">No has visto películas</p>
          ) : (
            <div className="space-y-2">
              {watched.slice(0, 5).map((item: UserMovieList) => (
                <Link
                  key={item.id}
                  href={`/movie/${item.movieId}`}
                  className="block text-gray-300 hover:text-red-500 text-sm truncate"
                >
                  ID: {item.movieId}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Mis Reviews</h2>
        {reviews.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
            <p className="text-gray-400">No has escrito ninguna review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: Review) => (
              <div key={review.id} className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/movie/${review.movieId}`}
                    className="text-white font-medium hover:text-red-500"
                  >
                    Película #{review.movieId}
                  </Link>
                  <span className="text-gray-500 text-sm">
                    • {new Date(review.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <p className="text-yellow-500 text-sm mb-2">
                  {'★'.repeat(Math.round(review.rating))}
                  {'☆'.repeat(5 - Math.round(review.rating))}
                </p>
                <p className="text-gray-300 text-sm">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
