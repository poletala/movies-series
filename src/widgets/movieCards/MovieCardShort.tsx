import './movie-card-short.css'
import { ShortImage, Rating } from '@openmoviedb/kinopoiskdev_client';

type Props = {
    id: number,
    SRC: ShortImage | undefined,
    name: string | undefined,
    shortDescription: string | undefined,
    // rating: Rating['imdb'] | undefined,
    rating: Rating | undefined,
    year: number | undefined,
}

export const MovieCardShort = (props: Props) => {


    return (
        <div className="movie-card-short" key={props.id}>
            <div  className="movie-card-short-poster" style={{backgroundImage: `url(${props.SRC?.url})`}}>
                <div className="movie-card-short-rating">{props.rating?.imdb}</div>
                <div className="movie-card-short-year">{props.year}</div>
            </div>
            <h2 className="movie-card-short-name">{props.name}</h2>
            <p className="movie-card-short-description" lang='ru'>{props.shortDescription}</p>
            {/* <button className="view-movie-btn">Смотреть</button> */}
        </div>
    )
}