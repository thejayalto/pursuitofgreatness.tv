"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { getMovies, type Movie } from "@/lib/movies"

export function MovieDisplay() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [unseenIndices, setUnseenIndices] = useState<number[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMovies() {
      const data = await getMovies()
      const startIndex = Math.floor(Math.random() * data.length)
      setMovies(data)
      setCurrentIndex(startIndex)
      setUnseenIndices(
        Array.from({ length: data.length }, (_, i) => i).filter(i => i !== startIndex)
      )
      setIsLoading(false)
      
      // Preload all poster images (optimized by Next.js, ~4-5MB total)
      data.forEach((movie) => {
        const img = new window.Image()
        img.src = `/_next/image?url=${encodeURIComponent(movie.show_poster_url)}&w=640&q=75`
      })
    }
    fetchMovies()
  }, [])

  const movie = movies[currentIndex]

  const handleShuffle = useCallback(() => {
    if (movies.length === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      let pool = unseenIndices
      if (pool.length === 0) {
        pool = Array.from({ length: movies.length }, (_, i) => i).filter(i => i !== currentIndex)
      }
      const randomIdx = Math.floor(Math.random() * pool.length)
      const newIndex = pool[randomIdx]
      setCurrentIndex(newIndex)
      setUnseenIndices(pool.filter(i => i !== newIndex))
      setIsTransitioning(false)
    }, 300)
  }, [currentIndex, movies.length, unseenIndices])

  return (
    <main 
      className="relative h-dvh overflow-hidden flex flex-col items-center px-4 pt-3 md:pt-5 text-foreground"
      style={{ 
        backgroundImage: 'url(/clouds13.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Masthead */}
      <header className="text-center mb-4 md:mb-12">
        <h1>
          <Image
            src="/logo2.png"
            alt="Pursuit of Greatness"
            width={500}
            height={50}
            className="h-14 md:h-20 w-auto"
            priority
          />
        </h1>
        <a 
          href="https://www.antislop.xyz/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="md:hidden inline-block mt-0.5"
        >
          <Image
            src="/poweredby3.png"
            alt="Powered by antislop"
            width={300}
            height={60}
            className="h-6 w-auto opacity-70"
          />
        </a>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center pb-24 md:pb-40">
        {isLoading ? (
          <div className="text-white text-lg">Loading...</div>
        ) : !movie ? (
          <div className="text-white text-lg">No movies found</div>
        ) : (
          <div
            className={`flex flex-col md:flex-row items-center gap-3 md:gap-8 max-w-3xl w-full transition-opacity duration-300 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Poster */}
            <div className="shrink-0 h-[40vh] md:h-auto md:w-[260px] lg:w-[280px]">
              <div className="relative aspect-[2/3] h-full md:h-auto md:w-full">
                <Image
                  key={movie.id}
                  src={movie.show_poster_url}
                  alt={`${movie.show_title} poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 200px, 280px"
                  priority
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center text-center md:text-left md:self-center">
              <h2 className="font-serif text-3xl md:text-3xl lg:text-4xl font-bold text-white leading-tight text-balance">
                {movie.show_title}
              </h2>
              <p className="-mt-1 text-base md:text-lg text-white">
                <span className="italic font-serif">Director:</span>{" "}
                {movie.show_director}
              </p>
              <p className="mt-2 md:mt-4 text-base md:text-xl text-white max-w-sm text-pretty">
                {movie.show_description.replace(/^["']|["']$/g, '')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Powered By Watermark - Desktop Only */}
      <a 
        href="https://www.antislop.xyz/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hidden md:block absolute bottom-4 right-4"
      >
        <Image
          src="/poweredby4.png"
          alt="Powered by antislop"
          width={120}
          height={40}
          className="h-20 w-auto opacity-70 hover:opacity-100 transition-opacity duration-200"
        />
      </a>

      {/* Shuffle Button */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 leading-[0]">
        <button
          onClick={handleShuffle}
          className="relative cursor-pointer group flex p-0 border-0"
          aria-label="Shuffle to a random movie recommendation"
        >
          <img
            src="/button4.png"
            alt="Shuffle"
            className="block h-44 md:h-56 w-auto max-w-none group-hover:opacity-0 transition-opacity duration-200"
          />
          <img
            src="/button4.2.png"
            alt=""
            className="block h-44 md:h-56 w-auto max-w-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </button>
      </div>
    </main>
  )
}
