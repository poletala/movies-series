import './movie-card-short.css'

type Props = {
    id: number,
    SRC: string,
    name?: string,
    shortDescription: string,
    rating: number,
    year: number,
}

export const MovieCardShort = (props: Props) => {


    return (
        <div className="movie-card-short" key={props.id}>
            <div  className="movie-card-short-poster" style={{backgroundImage: `url(${props.SRC})`}}>
                <div className="movie-card-short-rating">{props.rating.toFixed(1)}</div>
                <div className="movie-card-short-year">{props.year}</div>
            </div>
            <h2 className="movie-card-short-name">{props.name}</h2>
            <p className="movie-card-short-description" lang='ru'>{props.shortDescription}</p>
            {/* <button className="view-movie-btn">Смотреть</button> */}
        </div>
    )
}