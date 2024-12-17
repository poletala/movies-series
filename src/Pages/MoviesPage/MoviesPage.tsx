import { MovieCardShort } from '../../widgets/movieCards/movieCardShort/MovieCardShort'
import { useFetchMore } from '../../shared/hooks/useFetchMore'
import { queryForTopMovies } from '../../shared/constants/queries'
import { Loader } from '../../components/loader/Loader'
import { Filters } from '../../widgets/filters/Filters'
import { ScrollToTop } from '../../components/scrollToTop/ScrollToTop'
import './movies-page.css'

export const MoviesPage = () => {
    //Использование кастомного хука useFetchMore для загрузки фильмов
    const {
        data: moviesList,
        error: errorMoviesList,
        isError: isErrorMoviesList,
        isLoading: isLoadingMovies,
        fetchMore: fetchMoreMovies,
        limitFetch: limitFetchMovies } = useFetchMore({ query: queryForTopMovies, limitForQuery: 10 });
   
    if (errorMoviesList) console.error('ERROR MOVIE LIST ', errorMoviesList)

    return (
        <div  className="movies-list-page">
            {moviesList.length > 0 && (
                <Filters isMovie = {true}/>
            )}
            {moviesList.length > 0 && (<h2 className="header-movies-list">ТОП фильмов <span>IMDb</span></h2>)}
            <div className="movies-list">
                {moviesList?.map((movie) => (
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
            </div>
            <div className="arrow-area">
                {isLoadingMovies && (<Loader/>)}
                {isErrorMoviesList && !isLoadingMovies && (<div>Ошибка получения данных.</div>)}
                {/* {isErrorMoviesList && <div className='error-loading-movies'>{errorMoviesList}</div>} */}
                {moviesList.length > 0 && (
                    <button className="arrow-down" 
                        disabled={isLoadingMovies || limitFetchMovies >= 100} 
                        onClick={fetchMoreMovies}
                    >
                        +
                    </button>
                )}   
            </div>
            <ScrollToTop />
        </div>
    )
}