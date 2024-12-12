import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MovieDtoV13, KinopoiskDev } from '@openmoviedb/kinopoiskdev_client'
import { MovieCardFull } from '../../widgets/movieCards/MovieCardFull'
import { Loader } from '../../components/Loader'
import { API_KEYS } from '../../shared/hooks/useFetchMore'
import { ScrollToTop } from '../../components/ScrollToTop'
import './about-movie-page.css'

type Params = {
    id: string | undefined;
}

export const AboutMoviePage = () => {

    const [movieInfo, setMovieInfo] = useState<MovieDtoV13>()
    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { id } = useParams<Params>()

    const findId = Number(id?.slice(1))

    console.log('ID ', id, 'FindId ', findId)

    let kp = new KinopoiskDev(API_KEYS[0])
 
    //Функция поиска фильма по айди
    useEffect(() => {
        const getMovieByID = async () => {
            setIsLoading(true)
            const { data, error, message } = await kp.movie.getById(findId);
            if(data) {
                setMovieInfo(data)
                setIsError(false)
                setIsLoading(false)
            }
            if (error) {
                console.log(error, message);
                setIsError(true)
                setIsLoading(false)
                //если ошибка, то пробуем изменить ключ апи
                for (let i=0; i < API_KEYS.length; i++) {
                    kp = new KinopoiskDev(API_KEYS[i++]) 
                  }
                return
            }
        }
        id ? getMovieByID() : console.log('Movie not found')
        
    },[findId])

    console.log('MOVIE BY ID:', findId, 'INFO ABOUT MOVIE BY ID ', movieInfo)

    return (
        <>
        {isLoading && <div className="nodata"><Loader/></div>}
        {!isLoading && !isError &&
        <MovieCardFull
            id={movieInfo?.id}
            name={movieInfo?.name}
            enName={movieInfo?.enName}
            rating={movieInfo?.rating}
            year={movieInfo?.year}
            genres={movieInfo?.genres}
            countries={movieInfo?.countries}
            movieLength={movieInfo?.movieLength}
            ageRating={movieInfo?.ageRating}
            description={movieInfo?.description}
            SRC={movieInfo?.poster}
            backdrop={movieInfo?.backdrop}
            persons={movieInfo?.persons}
            similarMovies={movieInfo?.similarMovies}
            seasonsInfo={movieInfo?.seasonsInfo}
            status={movieInfo?.status}
            isSeries={movieInfo?.isSeries}
        />}
        {isError && <div className="nodata">Ошибка получения данных.</div>}
        <ScrollToTop />
        </>
    )
}