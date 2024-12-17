import { useEffect, useState } from 'react'
import { KinopoiskDev, MeiliMovieEntity, MovieQueryBuilder } from '@openmoviedb/kinopoiskdev_client'
import { useCustomNavigation } from '../../shared/hooks/useCustomNavigation'
import { ScrollToTop } from '../../components/scrollToTop/ScrollToTop'
import { Loader } from '../../components/loader/Loader'
import { API_KEYS } from '../../shared/hooks/useFetchMore'
import './search-page.css'

type Results = {
  id: number,
  poster: string,
  name: string,
  shortDescription: string | undefined,
  rating: number | undefined,
  year: number | undefined,
}

export let kp = new KinopoiskDev('V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ');

export const SearchPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorSearch, setErrorSearch] = useState<string | null>(null)
  const [searchResult, setSearchResult] = useState<MeiliMovieEntity[]>([])
  const [limitFetch, setLimitFetch] = useState<number>(10)
  
  const navigate = useCustomNavigation()
   
  if (isError) console.log(errorSearch)

  //Пытаемся получить данные о названии фильма, который нужно найти, из локалсторэдж
  const movieName: string = localStorage.getItem('search')!

  //Функция поиска по названию фильма
  useEffect(() => {
    const searchMoreMovies = async (limit: number) => {
      setIsLoading(true)
      const queryBuilder = new MovieQueryBuilder()
      const query = queryBuilder
        .query(movieName)
        .paginate(1, limit)
        .build();
      const { data, error, message } = await kp.movie.getBySearchQuery(query)
      if (data) {
        const { docs: searchData } = data;
        setSearchResult(searchData)
        setIsLoading(false)
        setIsError(false)
        // console.log('SEARCH DATA ', searchData) 
      }
      if (error) {
        setIsLoading(false)
        setIsError(true)
        setErrorSearch(error)
        console.log('ERROR SEARCH ', error, message);
         //при ошибке пробуем сменить апи ключ
         for (let i=0; i < API_KEYS.length; i++) {
          kp = new KinopoiskDev(API_KEYS[i++]) 
        }
        return
      }
    }
      movieName ? searchMoreMovies(limitFetch) : console.log('Empty search field')
  },[limitFetch, movieName])
 
    return (
      <>
      <div className="search-results">
        {movieName && 
          !searchResult.length && 
          !isError && 
          !isLoading && (
          <div>Попробуйте еще раз.</div>
        )}
        {isError && 
          !isLoading && (
            <div>Ошибка получения данных</div>
        )}
        {!movieName && !isError && (<div>Пусто.</div>)}
        {movieName && 
          searchResult.length > 0 && (
          searchResult.map((result: Results) => (
            <div className="movie-card-short" 
              key={result.id} 
              onClick={() => navigate.to(`/movies-series/:${result.id}`)}
            >
              <div  className="movie-card-short-poster" 
                style={{ backgroundImage: `url(${result.poster})` }}
              >
                  <div className="movie-card-short-rating">
                    {result.rating?.toFixed(1)}
                  </div>
                  <div className="movie-card-short-year">
                    {result.year}
                  </div>
              </div>
              <h2 className="movie-card-short-name">
                {result.name}
              </h2>
          </div>
      )))}
      </div>
        {isLoading && (
          <div className="loader-home-page"><Loader /></div>
        )}
        {movieName && 
          searchResult.length > 0 && (
          <div className="arrow-area">
            <button className="arrow-down" 
              onClick={() => setLimitFetch((prev) => prev + 5)}
            >
              +
            </button>
          </div>
        )}
      <ScrollToTop />
      </>
    )
}