import { useEffect, useState } from 'react';
import {
    KinopoiskDev,
    Filter,
    MovieFields,
    MovieDtoV13
  } from '@openmoviedb/kinopoiskdev_client';

// export let kp = new KinopoiskDev('V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ');
// export let kp1 = new KinopoiskDev('VD325FM-SDSMGH5-QBE4PD1-2JNX3Y3');
export let kp1 = new KinopoiskDev('SGBP95Q-G8M4CFN-NZ1P9F5-N3P5YWG')
export let kp = new KinopoiskDev('JZPD3MG-0JNMFYS-QXATV04-6KV52MX')

type FetchParams = {
  query: Filter<MovieFields>;
  limitForQuery: number;
}

export const useFetchMore = ({query, limitForQuery}: FetchParams) => {

  const [data, setData] = useState<MovieDtoV13[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<Boolean>(false)
  const [error, setError] = useState<null | string>(null)
  const [limitFetch, setLimitFetch] = useState(limitForQuery)

  useEffect(() => {
 
    let queryForLimit = {
        limit: limitFetch
    }
   
    let queryToFetch = Object.assign(query, queryForLimit)
    console.log('QUERY TO FETCH ', queryToFetch)
       
    setIsLoading(true)

    const getRelatedWithoutQueryBuilderMovies = async () => {
        
        const { data, error } = await kp.movie.getByFilters(queryToFetch)

        if(data) {
            setData(data.docs)
            setIsLoading(false)
            setIsError(false)
            console.log('FETCH MORE DATA ', data.docs)
            console.log(data)
        }
        if(error) {
            setIsLoading(false)
            setIsError(true) 
            console.log('FETCH MORE ERROR ', error)
            setError(error)
            kp = kp1
            return
        }
    }
    getRelatedWithoutQueryBuilderMovies()
 }, [limitFetch])

  const fetchMore = () => {
    setLimitFetch(prev => prev + 10)
  }

  return {data, isError, error, isLoading, fetchMore, limitFetch};
}
