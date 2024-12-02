import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MovieDtoV13, KinopoiskDev } from '@openmoviedb/kinopoiskdev_client'
import { MovieCardFull } from '../../widgets/movieCards/MovieCardFull'
import { Loader } from '../../components/Loader'
import './about-movie-page.css'

type Params = {
    id: string | undefined;
}

export const AboutMoviePage = () => {

    const [movieInfo, setMovieInfo] = useState<MovieDtoV13>()
    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { id } = useParams<Params>();
    const findId = Number(id?.slice(1))

    let kp1 = new KinopoiskDev('SGBP95Q-G8M4CFN-NZ1P9F5-N3P5YWG')
    let kp = new KinopoiskDev('JZPD3MG-0JNMFYS-QXATV04-6KV52MX')

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
                kp=kp1
                return
            }
        }
        id ? getMovieByID() : console.log('Movie not found')
    },[])

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
            similarMovies={movieInfo?.similarMovies}/>}
        {isError && <div className="nodata">Ошибка получения данных.</div>}
        </>
    )
}