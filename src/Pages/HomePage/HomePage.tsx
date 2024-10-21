// import { useQuery } from '@tanstack/react-query'
import './home-page.css'
import {
    KinopoiskDev,
    // MovieQueryBuilder,
    // MeiliMovieEntity,
    Filter,
    MovieFields,
    MovieDtoV13,
    // SeasonQueryBuilder,
    // SeasonFields,
    // KeywordFields,
    // SPECIAL_VALUE,
    // SORT_TYPE,
  } from '@openmoviedb/kinopoiskdev_client';
import { useEffect, useState } from 'react';
import { MovieCardShort } from '../../widgets/movieCards/MovieCardShort';
// import { http } from '../../shared/api/services';
// import  axios  from 'axios'


// const kp = new KinopoiskDev('V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ');
const kp = new KinopoiskDev('VD325FM-SDSMGH5-QBE4PD1-2JNX3Y3');


export const HomePage = () => {
    const [moviesList, setMoviesList] = useState<MovieDtoV13[]>([])
    const [isLoadingMovies, setIsLoadingMovies] = useState<boolean>(false)
    const [errorMoviesList, setErrorMoviesList] = useState<boolean>(false)

    const [seriesList, setSeriesList] = useState<MovieDtoV13[]>([])
    const [isLoadingSeries, setIsLoadingSeries] = useState<boolean>(false)
    const [errorSeriesList, setErrorSeriesList] = useState<boolean>(false)

    

    useEffect(() => {
        const getRelatedWithoutQueryBuilderMovies = async () => {
            const query: Filter<MovieFields> = {
                selectFields: ['id', 'name', 'rating', 'poster', 'year', 'top250', 'shortDescription'],
                year: '1950-2023',
                'rating.kp': '8-10',
                'poster.url': '!null',
                'name' : '!null',
                'top250' : '!null',
                'shortDescription' : '!null',
                'isSeries' : 'true',
                sortField: 'rating.imdb',
                sortType: '-1',
                page: 1,
                limit: 5,
            };
      
            // Отправляем запрос на получение фильмов
            const { data, error, message } = await kp.movie.getByFilters(query);

            error ? setErrorSeriesList(true) : setErrorSeriesList(false)
            if(data) {
                setSeriesList(data.docs), 
                setIsLoadingSeries(false)
            }
        }
    getRelatedWithoutQueryBuilderMovies()
    // searchSeries()
    },[])


    useEffect(() => {
        const searhcMovies = async () => {

            const query: Filter<MovieFields> = {
                selectFields: ['id', 'name', 'rating', 'poster', 'year', 'top250', 'shortDescription'],
                year: '1950-2023',
                'rating.kp': '8-10',
                'poster.url': '!null',
                'name' : '!null',
                'top250' : '!null',
                'shortDescription' : '!null',
                'isSeries' : 'false',
                'type' : 'movie',
                sortField: 'rating.imdb',
                sortType: '-1',
                page: 1,
                limit: 5,
            };

            const { data, error, message } = await kp.movie.getByFilters(query);
       
            error ? setErrorMoviesList(true) : setErrorMoviesList(false)
            if(data) {
                setMoviesList(data.docs), 
                setIsLoadingMovies(false)
            }
        }

    searhcMovies()

    },[])

  
  
    console.log(moviesList, seriesList)
        
    return (
        <>
        <div>
            <h2 className='header-main-list'>ТОП фильмов <span>IMDb</span> </h2>
            <div className='movies-list-top'>
                {moviesList?.map((movie) => (
                    <MovieCardShort 
                        id={movie.id} 
                        SRC={movie.poster} 
                        name={movie.name} 
                        shortDescription={movie.shortDescription}
                        rating={movie.rating}
                        year={movie.year} />
                ))}
                {isLoadingMovies && <div>Идет загрузка...</div>}
                {errorMoviesList && <div>{errorMoviesList}</div>}
            </div>
            <h2 className='header-main-list'>ТОП сериалов <span>IMDb</span></h2>
            <div className='series-list-top'>
            {seriesList?.map((series) => (
                    <MovieCardShort 
                        id={series.id} 
                        SRC={series.poster} 
                        name={series.name} 
                        shortDescription={series.shortDescription}
                        rating={series.rating}
                        year={series.year} />
                ))}
                {isLoadingSeries && <div>Идет загрузка...</div>}
                {errorSeriesList && <div>{errorSeriesList}</div>}

            </div>
        </div>
        </>
    )
}