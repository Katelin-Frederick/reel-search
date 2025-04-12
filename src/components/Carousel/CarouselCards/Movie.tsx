'use client'

import { useRouter, } from 'next/navigation'
import { ImageOff, } from 'lucide-react'
import { useState, } from 'react'
import Image from 'next/image'

import type { TMDBMovie, } from '~/types/movies'

import Button from '~/components/Button/Button'
import { formatDate, } from '~/lib/utils'

const Movie = ({ movie, }: { movie: TMDBMovie }) => {
  const router = useRouter()
  const [hasImageError, setHasImageError] = useState(false)

  return (
    <div className='flex flex-col h-full w-full max-w-xs bg-gray-800 rounded-lg overflow-hidden'>
      <div className='relative w-full aspect-[2/3] bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-800'>
        {hasImageError || !movie.poster_path ? (
          <div className='absolute inset-0 flex items-center justify-center text-gray-300 text-sm px-2 text-center bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-800'>
            <div className='flex flex-col items-center'>
              <ImageOff className='w-10 h-10 mb-2 text-gray-500' />
              <span className='text-lg text-gray-800'>{`No image available for ${movie.title}`}</span>
            </div>
          </div>
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className='object-cover'
            onError={() => setHasImageError(true)}
          />
        )}
      </div>

      <div className='flex flex-col flex-grow p-4 border-t-5 border-gray-100'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-semibold'>{movie.title}</h3>
          <p className='text-sm text-yellow-500'>{formatDate(movie.release_date ?? '')}</p>

          <h4 className='text-lg font-semibold mt-2'>Overview</h4>
          <p className='line-clamp-3 text-sm text-gray-300'>
            {movie.overview || 'N/A'}
          </p>
        </div>

        <div className='mt-auto p-4 flex justify-center'>
          <Button onClick={() => router.push(`/movie/${movie.id}`)}>View Details</Button>
        </div>
      </div>
    </div>
  )
}

export default Movie
