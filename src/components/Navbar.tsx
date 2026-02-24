'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import SearchBar from './SearchBar'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-[#333]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-red-500 text-2xl">🎬</span>
            <span className="text-white font-bold text-xl">CineIA</span>
          </Link>

          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar />
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/explore?sort_by=vote_average.desc&min_votes=500"
              className="text-gray-300 hover:text-yellow-500 transition-colors text-sm font-medium"
              title="Top Rated"
            >
              ⭐ Top
            </Link>
            <Link
              href="/explore?type=now_playing"
              className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium"
              title="En Cartelera"
            >
              🎬 Cartelera
            </Link>
            <Link
              href="/lists"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Mis Listas
            </Link>
            <Link
              href="/explore"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Explorar
            </Link>

            {session ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-medium">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  )}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
