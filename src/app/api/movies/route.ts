import { NextResponse } from 'next/server'
import { getPopularMovies, getTrendingMovies, getTopRatedMovies, getNowPlayingMovies } from '@/lib/tmdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'popular'
  const page = parseInt(searchParams.get('page') || '1')

  try {
    let data
    switch (type) {
      case 'trending':
        data = await getTrendingMovies(page)
        break
      case 'top_rated':
        data = await getTopRatedMovies(page)
        break
      case 'now_playing':
        data = await getNowPlayingMovies(page)
        break
      case 'popular':
      default:
        data = await getPopularMovies(page)
        break
    }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener películas' },
      { status: 500 }
    )
  }
}
