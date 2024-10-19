import './movies-page.css'
import {
    KinopoiskDev,
    MovieQueryBuilder,
    SPECIAL_VALUE,
    SORT_TYPE,
  } from '@openmoviedb/kinopoiskdev_client';
import { useEffect, useState } from 'react';
import { MovieCardShort } from '../../widgets/movieCards/MovieCardShort';

// const kp = new KinopoiskDev('V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ');
const kp = new KinopoiskDev('VD325FM-SDSMGH5-QBE4PD1-2JNX3Y3');

export interface MeiliMovieEntity {
    id: number;
    name: string;
    alternativeName: string;
    enName: string;
    names: Array<string>;
    type: string;
    year: number;
    description: string;
    shortDescription: string;
    logo: string;
    poster: string;
    backdrop: string;
    rating: number;
    votes: number;
    movieLength: number;
    genres: Array<string>;
    countries: Array<string>;
    releaseYears: Array<number>;
  }

  
  
export const MoviesPage = () => {
    const [moviesList, setMoviesList] = useState<MeiliMovieEntity[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMovieList, setErrorMovieList] = useState<boolean>(false)


    // //сохраняем скаченные данные в локал сторэдж 
    // function saveList(data: MeiliMovieEntity[], name: string) {
    //     let savedItems = JSON.parse(localStorage.getItem(name) || '[]')
     
    //     if(savedItems) {
        
    //         for (let i = 0; i < savedItems.length; i++) {
    //             for (let j=0; j < data.length; j++) {
    //                 if(savedItems[i].id === data[j].id) {
    //                     savedItems.splice(i, 1);
    //                 }
    //             }
    //         }
    //         savedItems.push(...data)
    //         localStorage.setItem(name, JSON.stringify(savedItems))
    //     } else  {
    //         localStorage.setItem(name, JSON.stringify(data))
    //     }
        
    //     console.log(`${name} saved to localStorage`)
    //  }
    
    useEffect(() => {
        const getRelatedByQueryBuilderMovies =async () => {
            const queryBuilder = new MovieQueryBuilder();
          
            const query = queryBuilder
              .select(['id', 'name', 'rating', 'poster', 'year'])
              .filterRange('year', [2020, 2023])
              .filterRange('rating.kp', [7.5, 10])
              .filterExact('poster.url', SPECIAL_VALUE.NOT_NULL)
              .sort('rating.kp', SORT_TYPE.DESC)
              .paginate(1, 20)
              .build();
            console.log('query: ', query);

            setIsLoading(true)
            const { data, error, message } = await kp.movie.getBySearchQuery(query);

            error ? setErrorMovieList(true) : setErrorMovieList(false)
            if(data) {
                setMoviesList(data.docs), 
                setIsLoading(false)
            }

            console.log('data ', data, 'error ', error, 'message ', message);

          };
          
          getRelatedByQueryBuilderMovies();

        }, [])

        console.log('Movies List: ', moviesList)
    
    return (
        <>
        <div>
            <div className='movies-list'>
                {moviesList?.map((movie) => (
                    <MovieCardShort 
                        id={movie.id} 
                        SRC={movie.poster} 
                        // name={movie.name} 
                        shortDescription={movie.shortDescription}
                        rating={movie.rating}
                        year={movie.year} />
                ))}
                {isLoading && <div>Loading...</div>}
                {errorMovieList && <div>{errorMovieList}</div>}
            </div>
        </div>
        </>
    )
}