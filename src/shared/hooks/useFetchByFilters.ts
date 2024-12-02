import { useEffect, useState } from 'react'
import {
    KinopoiskDev,
    Filter,
    MovieFields,
    MovieDtoV13
  } from '@openmoviedb/kinopoiskdev_client'
import { API_KEYS } from './useFetchMore';

// let kp = new KinopoiskDev('V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ');
// let kp1 = new KinopoiskDev('VD325FM-SDSMGH5-QBE4PD1-2JNX3Y3');
let kp = new KinopoiskDev('SGBP95Q-G8M4CFN-NZ1P9F5-N3P5YWG');
// let kp1 = new KinopoiskDev('JZPD3MG-0JNMFYS-QXATV04-6KV52MX');

type FetchParams = {
  query: Filter<MovieFields>;
  limitForQuery: number;
  genre?: string;
  country?: string;
  isMovie: boolean;
  yearFrom?: number;
  yearTo?: number;
  sortBy?: string; 
}

export const useFetchByFilters = ({query, limitForQuery, genre, country, isMovie, yearFrom, yearTo, sortBy }: FetchParams) => {

  const [data, setData] = useState<MovieDtoV13[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<Boolean>(false)
  const [error, setError] = useState<null | string>(null)
  const [limitFetch, setLimitFetch] = useState(limitForQuery)
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const [isNoData, setIsNoData] = useState<boolean>(false)
 
  useEffect(() => {
    
    let queryParams = {
        limit: limitFetch,
        'genres.name' : genre ? genre : '!null',
        'countries.name' : country ? country : '!null',
        'isSeries': isMovie ?  false : true,
        'type' : isMovie ? 'movie' : 'tv-series',
        'year' : (yearFrom && yearTo) ? `${yearFrom}-${yearTo}` : 
                    (yearFrom && !yearTo) ? `${yearFrom}-2023` : 
                    (!yearFrom && yearTo) ? `1923-${yearTo}` : '1923-2023',
        'sortField' : sortBy ? sortBy : 'rating.imdb'
    }

    let queryToFetch = Object.assign(query, queryParams)
    console.log('QUERY TO FETCH ', queryToFetch)
       
    const getMoviesByFilters = async () => {
        
        setIsLoading(true)
        const { data, error } = await kp.movie.getByFilters(queryToFetch);

        if(data) {
            setData(data.docs)
            setIsLoading(false)
            setIsError(false)
            setShouldFetch(false)
            setIsNoData(false)
            console.log('FETCHED DATA BY FILTERS ', data.docs)
        }
        if(error) {
            setIsLoading(false)
            setIsError(true)
            setIsNoData(false)
            console.log('FETCH ERROR BY FILTERS', error)
            setError(error)
            setShouldFetch(false)
            for (let i=0; i < API_KEYS.length; i++) {
              kp = new KinopoiskDev(API_KEYS[i++]) 
            }
            return
        }
        if(data?.docs.length === 0 && !error) {
            setIsNoData(true)
            setIsLoading(false)
            setShouldFetch(false)
        }
    }
    if (shouldFetch) getMoviesByFilters()

 }, [limitFetch, shouldFetch])

    
  const fetchMore = () => {
    setShouldFetch(true)
    setLimitFetch(prev => prev + 5)
  }
  const letsFetch = () => {
    setShouldFetch(true)
    setLimitFetch(limitForQuery)
  }
  const clearFilters = () => {
    setData([])
    setIsNoData(false)
    setIsError(false)
  }
  return { data, isError, error, isLoading, isNoData, fetchMore, limitFetch, letsFetch, clearFilters }
}
