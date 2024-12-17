import { useEffect, useState } from 'react'
import { KinopoiskDev, MovieDtoV13 } from '@openmoviedb/kinopoiskdev_client'
import Slider from 'react-slick'
import { MovieCardShort } from '../../widgets/movieCards/movieCardShort/MovieCardShort'
import { useFetchMore, API_KEYS } from '../../shared/hooks/useFetchMore'
import { queryForTopMovies, queryForTopSeries } from '../../shared/constants/queries'
import { Loader } from '../../components/loader/Loader'
import { MovieCardRandom } from '../../widgets/movieCards/movieCardRandom/MovieCardRandom'
import { ScrollToTop } from '../../components/scrollToTop/ScrollToTop'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './home-page.css'

export const HomePage = () => {
    const [randomMovie, setRandomMovie] = useState<MovieDtoV13>()
    const [isLoadingRandomMovie, setIsLoadingRandomMovie] = useState<boolean>(false)
    const [isRandomMovieError, setIsRandomMovieError] = useState<boolean>(true)

    //Используем кастомный хук useFetchMore для загрузки информации о фильмах
    const {
        data: moviesList,
        isError: isErrorMoviesList,
        isLoading: isLoadingMovies,
        } = useFetchMore({ query: queryForTopMovies, limitForQuery: 100 });

    const { 
        data: seriesList
        } = useFetchMore({ query: queryForTopSeries, limitForQuery: 100 });

    let kp = new KinopoiskDev('SGBP95Q-G8M4CFN-NZ1P9F5-N3P5YWG');
    //Функция получения рандомного фильма
    const getRandomMovie = async () => {
        setIsLoadingRandomMovie(true)
        const { data: randomMovie, error: randomMovieError } = await kp.movie.getRandom();
        if (randomMovie) {
            setIsLoadingRandomMovie(false)
            setRandomMovie(randomMovie)
            setIsRandomMovieError(false)
            // console.log('RANDOM MOVIE ', randomMovie);
        }
        if (randomMovieError) {
            setIsLoadingRandomMovie(false)
            setIsRandomMovieError(true)
            //при ошибке пробуем сменить апи ключ
            for (let i=0; i < API_KEYS.length; i++) {
                kp = new KinopoiskDev(API_KEYS[i++]) 
              }
            // console.log('RANDOM MOVIE ERROR ', randomMovieError);
        }
    }

    useEffect(() => {
        getRandomMovie()
    },[])

    //Настройки для Слайдера
    function NextArrow(props: any) {
        const { onClick } = props;
        return (
          <div
            className="load-btn right-arrow movies-area"
            onClick={onClick}
           >
             &gt;
           </div>
        )
    }
    function PrevArrow(props: any) {
        const { onClick } = props;
        return (
          <div
            className="load-btn arrow-left"
            onClick={onClick}
          >
            &#60;
          </div>
        )
    }
    const settings = {
        dots: false,
        arrows: true,
        speed: 500,
        className: "center",
        centerMode: true,
        centerPadding: "20px",
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [{
            breakpoint: 1025, 
            settings: {
                slidesToShow: 3, 
                slidesToScroll: 1, 
            }
        }, {
            breakpoint: 769,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                centerPadding: "100px"
            }
        }, {
            breakpoint: 426,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerPadding: "70px"
            }
        }]
    }

    return (
        <>
        <div style={{ paddingBottom: '20px' }}>
            {isErrorMoviesList && !isLoadingMovies && (<div className="error-home">Ошибка получения данных.</div>)}
            {isLoadingMovies && (<div className="loader-home-page"><Loader /></div>)}
            {moviesList.length > 0 && (
            <div  className="testscroller-movies">
                <h2 className="header-main-list">ТОП фильмов <span>IMDb</span></h2>
                    {moviesList.length > 0 && (
                        <Slider {...settings}>
                            {moviesList.map((movie) => (
                                <MovieCardShort
                                    key={movie.id}
                                    id={movie.id}
                                    SRC={movie.poster}
                                    name={movie.name}
                                    shortDescription={movie.shortDescription}
                                    rating={movie.rating}
                                    year={movie.year} 
                                />
                            ))}
                        </Slider>
                    )}
            </div>
            )}
            {seriesList.length > 0 && (
            <div className="testscroller">
                <h2 className="header-main-list">ТОП сериалов <span>IMDb</span></h2>
                {seriesList.length > 0 && (
                    <Slider {...settings}>
                        {seriesList.map((series) => (
                            <MovieCardShort
                            key={series.id}
                            id={series.id}
                            SRC={series.poster}
                            name={series.name}
                            shortDescription={series.shortDescription}
                            rating={series.rating}
                            year={series.year} 
                            />
                        ))}
                    </Slider>
                )}
            </div>
            )}
            {!isRandomMovieError && (
                <div className="random-movie">
                    <h2 className="header-main-list">Случайный фильм</h2>
                    <MovieCardRandom
                        key={randomMovie?.id}
                        id={randomMovie?.id}
                        SRC={randomMovie?.poster}
                        name={randomMovie?.name}
                        shortDescription={randomMovie?.shortDescription}
                        description={randomMovie?.description}
                        rating={randomMovie?.rating}
                        year={randomMovie?.year}
                        genres={randomMovie?.genres}
                        countries={randomMovie?.countries}
                        ageRating={randomMovie?.ageRating}
                        movieLength={randomMovie?.movieLength}
                        enName={randomMovie?.enName}
                        onClick={getRandomMovie}
                        isLoading={isLoadingRandomMovie}
                    />
                </div>
                )}
        </div>
        <ScrollToTop />
        </>
    )
}