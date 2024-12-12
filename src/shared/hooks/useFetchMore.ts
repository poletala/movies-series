import { useEffect, useState } from 'react';
import {
    KinopoiskDev,
    Filter,
    MovieFields,
    MovieDtoV13
  } from '@openmoviedb/kinopoiskdev_client';

export const API_KEYS = ['V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ', 
                        'VD325FM-SDSMGH5-QBE4PD1-2JNX3Y3', 
                        'SGBP95Q-G8M4CFN-NZ1P9F5-N3P5YWG', 
                        'JZPD3MG-0JNMFYS-QXATV04-6KV52MX']

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
    //устанавливаем условие количества фильмов, которые нужно загрузить
    let queryForLimit = {
        limit: limitFetch
    }
   //соединяем условие выше с фильтром поиска фильмов
    let queryToFetch = Object.assign(query, queryForLimit)
    console.log('QUERY TO FETCH ', queryToFetch)
       
    setIsLoading(true)
    //Функция поиска фильмов по нашим фильтрам
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
            //при ошибке пробуем сменить апи ключ
            for (let i=0; i < API_KEYS.length; i++) {
              kp = new KinopoiskDev(API_KEYS[i++]) 
            }
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
