import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getMovieDetails, getMovieCredits, getImageUrl } from '@/lib/tmdb'
import RatingStars from '@/components/RatingStars'
import ReviewCard from '@/components/ReviewCard'
import ReviewForm from '@/components/ReviewForm'
import MovieActions from '@/components/MovieActions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params
  const movieId = parseInt(id)

  if (isNaN(movieId)) {
    notFound()
  }

  const [movie, credits] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId)
  ])

  const director = credits.crew.find(c => c.job === 'Director')
  const cast = credits.cast.slice(0, 6)

  return (
    <div className="min-h-screen">
      <div
        className="relative h-[50vh] md:h-[60vh]"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 0%, #0f0f0f 100%), url(${getImageUrl(movie.backdrop_path, 'original')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <div className="relative w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              {movie.poster_path ? (
                <Image
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                  <span className="text-gray-500">Sin póster</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            <p className="text-gray-400 mb-4">
              {movie.release_date?.split('-')[0]} • {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'}
              {movie.genres.length > 0 && ` • ${movie.genres.map(g => g.name).join(', ')}`}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <RatingStars rating={movie.vote_average / 2} readonly size="md" />
                <span className="text-gray-400 text-sm">
                  ({movie.vote_count.toLocaleString()} votos)
                </span>
              </div>
            </div>

            {movie.tagline && (
              <p className="text-gray-500 italic mb-6">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Sinopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || 'No hay sinopsis disponible.'}
              </p>
            </div>

            {director && (
              <div className="mb-6">
                <h3 className="text-gray-400 text-sm">Director</h3>
                <p className="text-white">{director.name}</p>
              </div>
            )}

            <MovieActions movie={{ id: movie.id, title: movie.title, poster_path: movie.poster_path }} />
          </div>
        </div>

        {cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Reparto</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cast.map((actor) => (
                <div key={actor.id} className="shrink-0 w-24 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-[#1a1a1a] mb-2">
                    {actor.profile_path ? (
                      <Image
                        src={getImageUrl(actor.profile_path, 'w185')}
                        alt={actor.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium truncate">{actor.name}</p>
                  <p className="text-gray-500 text-xs truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
          <ReviewForm movieId={movieId} />
        </section>
      </div>
    </div>
  )
}
