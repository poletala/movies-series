import { useState } from 'react'
import { useCustomNavigation } from '../../shared/hooks/useCustomNavigation'
import { ScrollToTop } from '../../components/scrollToTop/ScrollToTop'
import '../../widgets/movieCards/movieCardShort/movie-card-short.css'
import './my-list-page.css'

type movieInfo = {
    id: number,
    name: string,
    rating: number,
    year: number,
    SRC: string
}

export const MyListPage = () => {
    //Пробуем получить данные о сохраненных фильмах из локалсторэдж
    const savedList: Array<movieInfo> = JSON.parse(localStorage.getItem('myList') || '[]');
    const [moviesList, setMoviesList] = useState<Array<movieInfo>>(savedList)
    const navigate = useCustomNavigation()

    //Функция удаления фильма из моего списка
    function deleteFromMyList(id: number) {
        if (moviesList.length > 1) {
            const index = moviesList.findIndex((movie) => movie.id === id)
            // console.log('INDEX ', index, 'ID ', id)
            moviesList.splice(index, 1)
            setMoviesList(prevState => prevState.filter((prev) => prev.id !== id))
            // console.log('MY LIST spliced', moviesList)
            localStorage.setItem('MY NEW LIST ', JSON.stringify(moviesList))
            return moviesList
        }
        if (moviesList.length === 1) {
            setMoviesList([])
            localStorage.setItem('myList', '[]');
            return moviesList
        }
        // console.log('MY LIST AFTER DELETING ', moviesList)
    }

    return (
        <>
        <h1 className="my-list-header">Мой список фильмов</h1>
        <div className="my-list-of-movies">
            {(moviesList.length === 0) && (<div className="my-list-empty">Список пуст.</div>)}
            {moviesList.length > 0 && (
                moviesList?.map((movie) => (
                <div className="movie-card-short movie-list" key={movie.id}>
                    <button className="delete-from-my-list" onClick={() => deleteFromMyList(movie.id)}></button>
                    <div  className="movie-card-short-poster" 
                            onClick={() => navigate.to(`/movies-series/:${movie.id}`)} 
                            style={{ backgroundImage: `url(${movie.SRC})` }}
                    >
                        <div className="movie-card-short-rating" >{movie.rating}</div>
                        <div className="movie-card-short-year">{movie.year}</div>
                    </div>
            </div>
            )))}
        </div>
        <ScrollToTop />
        </>
    )
}