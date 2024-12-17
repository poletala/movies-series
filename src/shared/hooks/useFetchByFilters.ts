import { useEffect, useState } from 'react'
import {
    KinopoiskDev,
    Filter,
    MovieFields,
    MovieDtoV13
  } from '@openmoviedb/kinopoiskdev_client'
import { API_KEYS } from './useFetchMore';

let kp = new KinopoiskDev('SGBP95Q-G8M4CFN-NZ1P9F5-N3P5YWG');

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

export const useFetchByFilters = ({ query, limitForQuery, genre, country, isMovie, yearFrom, yearTo, sortBy }: FetchParams) => {

  const [data, setData] = useState<MovieDtoV13[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<Boolean>(false)
  const [error, setError] = useState<null | string>(null)
  const [limitFetch, setLimitFetch] = useState(limitForQuery)
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const [isNoData, setIsNoData] = useState<boolean>(false)
 
  //Функция устанавливает допфильтры для поиска фильмов
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    
    let queryParams = {
        limit: limitFetch,
        'genres.name' : genre ? genre : '!null',
        'countries.name' : country ? country : '!null',
        'isSeries': isMovie ?  false : true,
        'type' : isMovie ? 'movie' : 'tv-series',
        'year' : (yearFrom && yearTo) ? `${yearFrom}-${yearTo}` : 
                    (yearFrom && !yearTo) ? `${yearFrom}-${currentYear}` : 
                    (!yearFrom && yearTo) ? `1923-${yearTo}` : `1923-${currentYear}`,
        'sortField' : sortBy ? sortBy : 'rating.imdb'
    }

    //Соединяем допфильтры выше и фильтры для поиска
    let queryToFetch = Object.assign(query, queryParams)
    // console.log('QUERY TO FETCH ', queryToFetch)
    //Функция поиска фильмов по итоговой фильтрации
    const getMoviesByFilters = async () => {
        setIsLoading(true)
        const { data, error } = await kp.movie.getByFilters(queryToFetch);

        if (data) {
            setData(data.docs)
            setIsLoading(false)
            setIsError(false)
            setShouldFetch(false)
            setIsNoData(false)
            // console.log('FETCHED DATA BY FILTERS ', data.docs)
        }
        if (error) {
            setIsLoading(false)
            setIsError(true)
            setIsNoData(false)
            console.log('FETCH ERROR BY FILTERS', error)
            setError(error)
            setShouldFetch(false)
            //при ошибка пробуем сменить апи ключ
            for (let i=0; i < API_KEYS.length; i++) {
              kp = new KinopoiskDev(API_KEYS[i++]) 
            }
            return
        }
        if (!data?.docs.length && !error) {
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
