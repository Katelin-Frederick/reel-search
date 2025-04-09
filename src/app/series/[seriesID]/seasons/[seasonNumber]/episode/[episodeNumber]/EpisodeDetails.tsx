'use client'

import Link from 'next/link'

import { getSubtitle, getDirector, formatDate, cn, } from '~/lib/utils'
import Carousel from '~/components/Carousel/Carousel'
import Poster from '~/components/Poster/Poster'
import Button from '~/components/Button/Button'
import { api, } from '~/trpc/react'
import { rockSalt, } from '~/fonts'

const EpisodeDetails = ({
  seriesID,
  seasonNumber,
  episodeNumber,
}: { seriesID: string, seasonNumber: string, episodeNumber: string }) => {
  const {
    data: seriesDetails,
    isLoading, error:
    seriesDetailsError,
  } = api.series.getDetails.useQuery(
    { id: seriesID, },
    { enabled: !!seriesID, }
  )

  const {
    data: episodeDetails,
    isLoading: isEpisodeDetailsLoading,
    error: episodeDetailsError,
  } = api.series.getEpisodeDetails.useQuery(
    { seriesId: seriesID, seasonNumber, episodeNumber, },
    { enabled: !!seriesID, }
  )

  const {
    data: episodeCredits,
    isLoading: isEpisodeCreditsLoading,
    error: episodeCreditsError,
  } = api.series.getEpisodeCredits.useQuery(
    { seriesId: seriesID, seasonNumber, episodeNumber, },
    { enabled: !!seriesID, }
  )

  const {
    data: rating,
    isLoading: isRatingLoading,
    error: ratingError,
  } = api.series.getRating.useQuery(
    { id: seriesID, },
    { enabled: !!seriesID, }
  )

  const formatRuntime = (runtime: number) => {
    const hours = Math.floor((runtime ?? 0) / 60)
    const remainingMinutes = (runtime ?? 0) % 60

    if (hours !== 0) {
      return `${hours}h ${remainingMinutes}m`
    }

    return `${remainingMinutes}m`
  }

  const getWriter = () => episodeDetails?.crew.filter((person) => person.job === 'Writer' || person.job === 'Story' || person.job === 'Screenplay').map((person) => person.name).join(', ')

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (seriesDetailsError) {
    return <div>Error loading movie details: {seriesDetailsError.message}</div>
  }

  return (
    <div>
      <h1 className='text-3xl md:text-4xl lg:text-5xl mb-3 text-center md:text-left font-bold'>{seriesDetails?.name}</h1>
      <p className='mb-3 text-center md:text-left'>{getSubtitle('series', rating ?? 'N/A')}</p>

      <h2 className='text-3xl mb-8 text-center md:text-left font-bold'>Episode</h2>

      <div className='flex flex-col md:flex-row'>
        <div className='w-[300px] h-auto relative self-center md:self-start md:justify-start mb-8 md:mb-0 shrink-0'>
          <Poster
            src={`https://image.tmdb.org/t/p/w185/${episodeDetails?.still_path}`}
            alt={episodeDetails?.name ?? ''}
            fallbackMessage={`No Poster for ${seriesDetails?.name}`}
            width={300}
            height={300}
            className='rounded-sm'
          />
        </div>

        <div className='md:ml-6'>
          <h3 className='text-3xl font-bold mb-4'>{`S${episodeDetails?.season_number} E${episodeDetails?.episode_number} - ${episodeDetails?.name}`}</h3>

          <p><span className='font-bold'>Air Date:</span> {formatDate(episodeDetails?.air_date ?? '')}</p>
          <p className='m-0'><span className='font-bold'>Runtime:</span> {formatRuntime(episodeDetails?.runtime ?? 0)}</p>
          <p className='m-0'><span className='font-bold'>Directed By:</span> {getDirector(episodeCredits?.crew ?? [])}</p>
          <p className='m-0'><span className='font-bold'>Written By:</span> {getWriter()}</p>

          <h3 className='text-3xl text-white mt-6'>Overview:</h3>
          <p>{episodeDetails?.overview ?? 'No Episode Overview Available'}</p>
        </div>
      </div>

      <div className='mt-12'>
        <h2
          className={cn('text-2xl text-yellow-500 mb-5', rockSalt.className)}
        >
          Cast
        </h2>
        <Carousel type='cast' data={[...episodeCredits?.cast ?? [], ...episodeCredits?.guest_stars ?? []]} />
      </div>

      <div>
        <Link
          href='/'
        >
          <Button variant='secondary' className='mt-8 mr-4'>Back to Search</Button>
        </Link>

        <Link
          href={`/series/${seriesID}/seasons`}
        >
          <Button className='mt-8'>Back to Season Details</Button>
        </Link>
      </div>
    </div>
  )
}

export default EpisodeDetails