import { useQuery } from '@tanstack/react-query'
import './home-page.css'
import {
    KinopoiskDev,
    MovieQueryBuilder,
    // SeasonQueryBuilder,
    // SeasonFields,
    // KeywordFields,
    SPECIAL_VALUE,
    SORT_TYPE,
  } from '@openmoviedb/kinopoiskdev_client';
import { useEffect, useState } from 'react';
import { MovieCardShort } from '../../widgets/movieCards/MovieCardShort';
import { http } from '../../shared/api/services';
// import  axios  from 'axios'


const kp = new KinopoiskDev('V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ');
// const kp = new KinopoiskDev('VD325FM-SDSMGH5-QBE4PD1-2JNX3Y3');


// type InitialListOfMovies = {
//     name: null,
//     countries: null,
//     description: null,
//     genres: null,
//     poster: null,
//     rating: null,
//     shortDescription: null,
//     year: null,
//     id: null
// }
// type ListOfMovies = {
//     name: string | null,
//     countries: string[] | null,
//     description: string | null,
//     genres: string[] | null,
//     poster: string | null,
//     rating: number | null,
//     shortDescription: string | null,
//     year: number | null,
//     id: number | null
// }
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

  
  
export const HomePage = () => {
    const [moviesList, setMoviesList] = useState<MeiliMovieEntity[]>([])
    const [isLoadingMovies, setIsLoadingMovies] = useState<boolean>(false)
    const [errorMovieList, setErrorMovieList] = useState<boolean>(false)

    // const [seriesList, setSeriessList] = useState<SeasonFields[]>([])
    // const [isLoadingSeries, setIsLoadingSeries] = useState<boolean>(false)
    // const [errorSeriesList, setErrorSeriesList] = useState<boolean>(false)

    // function saveList(data: MeiliMovieEntity[], name: string) {
    //     let savedItems = JSON.parse(localStorage.getItem(name) || '[]')
    //     console.log(savedItems)
     
    //     if(savedItems) {
        
    //         for (let i = 0; i < savedItems.length; i++) {
    //             for (let j=0; j < data.length; j++) {
    //                 if(savedItems[i].id === data[j].id) {
    //                     savedItems.splice(i, 1);
    //                 }
    //             }
    //         }
    //         console.log(savedItems);
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
              .select(['id', 'name', 'rating', 'poster', 'year', 'top250'])
              .filterRange('year', [2020, 2023])
              .filterRange('rating.kp', [7.5, 10])
              .filterExact('poster.url', SPECIAL_VALUE.NOT_NULL)
              .sort('rating.kp', SORT_TYPE.DESC)
              .paginate(1, 5)
              .build();
            console.log('query: ', query);

            setIsLoadingMovies(true)
            const { data, error, message } = await kp.movie.getBySearchQuery(query);

            error ? setErrorMovieList(true) : setErrorMovieList(false)
            data ? (setMoviesList(data.docs), setIsLoadingMovies(false)) : setErrorMovieList(true)

            console.log('data ', data, 'error ', error, 'message ', message);

          };
          
          getRelatedByQueryBuilderMovies();

        }, [])
  
            const {
                // isLoading: isLoadingSeries,
                // isError: isErrorSeries,
                data: seriesData,
              } = useQuery({
                queryKey: ['mainSeries'],
                queryFn: () => {
                  return http.get(
                    `/movie?page=1&isSeries=true&limit=25&selectFields=id&selectFields=name&selectFields=alternativeName&selectFields=movieLength&selectFields=poster&selectFields=rating&selectFields=year&selectFields=genres&notNullFields=top250&sortField=top250&sortType=1&lists=series-top250`,
                  );
                },
                select: (data) => data.data.docs,
                refetchOnWindowFocus: false,
              });
              console.log(seriesData)
       
    

  
        console.log('Movies List: ', moviesList)

    
    return (
        <>
        <div>
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
                {errorMovieList && <div>{errorMovieList}</div>}
            </div>
            <div className='series-list-top'>

            </div>
        </div>
        </>
    )
}