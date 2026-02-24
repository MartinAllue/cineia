import { NextResponse } from 'next/server'
import { searchMovies, getMoviesByGenre, discoverMovies } from '@/lib/tmdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const genre = searchParams.get('genre')
  const page = parseInt(searchParams.get('page') || '1')
  const sortBy = searchParams.get('sort_by')
  const year = searchParams.get('year')
  const minRating = searchParams.get('min_rating')
  const maxRating = searchParams.get('max_rating')
  const minVotes = searchParams.get('min_votes')

  try {
    if (query) {
      const data = await searchMovies(query, page)
      return NextResponse.json(data)
    }

    if (genre) {
      const data = await getMoviesByGenre(parseInt(genre), page)
      return NextResponse.json(data)
    }

    const params: Parameters<typeof discoverMovies>[0] = { page }
    if (sortBy) params.sort_by = sortBy
    if (year) {
      params['release_date.gte'] = `${year}-01-01`
      params['release_date.lte'] = `${year}-12-31`
    }
    if (minRating) params['vote_average.gte'] = parseFloat(minRating)
    if (maxRating) params['vote_average.lte'] = parseFloat(maxRating)
    
    // Mínimo de votos para evitar películas con pocas valoraciones
    const effectiveMinVotes = minVotes ? parseInt(minVotes) : 
      (sortBy === 'vote_average.desc' ? 500 : 0)
    if (effectiveMinVotes > 0) {
      params['vote_count.gte'] = effectiveMinVotes
    }

    const data = await discoverMovies(params)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al buscar películas' },
      { status: 500 }
    )
  }
}
