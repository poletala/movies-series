import {
    KinopoiskDev,
    Filter,
    MovieFields,
    MovieDtoV13,
  } from '@openmoviedb/kinopoiskdev_client';
import { useEffect, useState } from 'react';
import { MovieCardShort } from '../../widgets/movieCards/MovieCardShort';
import './movies-page.css'

// const kp = new KinopoiskDev('V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ');
const kp = new KinopoiskDev('VD325FM-SDSMGH5-QBE4PD1-2JNX3Y3');

export const MoviesPage = () => {

    const [moviesList, setMoviesList] = useState<MovieDtoV13[]>([])
    const [isLoadingMovies, setIsLoadingMovies] = useState<boolean>(false)
    const [errorMoviesList, setErrorMoviesList] = useState<boolean>(false)

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
                limit: 20,
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

    return (
        <div>
            <div className='movies-list'>
            {moviesList?.map((series) => (
                    <MovieCardShort 
                        id={series.id} 
                        SRC={series.poster} 
                        name={series.name} 
                        shortDescription={series.shortDescription}
                        rating={series.rating}
                        year={series.year} />
                ))}
               {isLoadingMovies && <div>Идет загрузка...</div>}
               {errorMoviesList && <div>{errorMoviesList}</div>}
            </div>
        </div>
    )
}