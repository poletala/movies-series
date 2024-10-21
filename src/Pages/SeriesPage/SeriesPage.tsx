import {
    KinopoiskDev,
    Filter,
    MovieFields,
    MovieDtoV13,
  } from '@openmoviedb/kinopoiskdev_client';
import { useEffect, useState } from 'react';
import { MovieCardShort } from '../../widgets/movieCards/MovieCardShort';

// const kp = new KinopoiskDev('V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ');
const kp = new KinopoiskDev('VD325FM-SDSMGH5-QBE4PD1-2JNX3Y3');

export const SeriesPage = () => {

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
                limit: 20,
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

    return (
        <div>
            <div className='movies-list'>
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
    )
}