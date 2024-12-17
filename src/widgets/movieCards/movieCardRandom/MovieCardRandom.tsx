import { Rating, ItemName, ShortImage } from '@openmoviedb/kinopoiskdev_client'
import { useCustomNavigation } from '../../../shared/hooks/useCustomNavigation'
import { Loader } from '../../../components/loader/Loader'
import './movie-card-random.css'
import '../movieCardFull/movie-card-full.css'

type Props = {
    id?: number;
    name?: string;
    enName?: string;
    rating?: Rating;
    year?: number;
    genres?: ItemName[];
    countries?: ItemName[];
    movieLength?: number;
    ageRating?: number;
    shortDescription?: string;
    description?: string;
    SRC?: ShortImage;
    onClick: () => void;
    isLoading?: boolean;
}

export const MovieCardRandom = (props: Props) => {
    //Фунцкция перевода времени в минутах в часы
    function getTimeFromMins(mins: number) {
        let hours = Math.trunc(mins/60);
        let minutes = mins % 60;
        return hours + 'ч. ' + minutes + 'м.';
    }
    const navigate = useCustomNavigation()

    return (
        <>
            <div 
                className="movie-card-full random-full" 
                key={props.id} 
            >
                {!props.isLoading && (
                    <button 
                        className="random-movie-btn" 
                        onClick={props.onClick}
                    >
                        &gt;
                    </button>
                )}
                {props.isLoading && (
                    <div className="random-loader"><Loader/></div>
                )}
                <div 
                    className="movie-card-full-poster random-poster" 
                    onClick={() => navigate.to(`/movies-series/:${props.id}`)} 
                    style={{ backgroundImage: `url(${props.SRC?.url})` }}
                >
                </div>
                <div className="movie-card-full-info random-info">
                    <div className="movie-card-full-name random-name">
                        <h2>{props.name}</h2>
                        <h4>{props.enName}</h4>
                    </div>
                    <div className="movie-card-full-details random-det">
                        <span className="movie-card-full-rating">
                            {props.rating?.imdb ? props.rating?.imdb : props.rating?.kp?.toFixed(1)}
                        </span>
                        <span className="movie-card-full-year">{props.year}</span>
                        {props.genres && (
                            <span className="movie-card-full-genre">
                                {String(props.genres?.map(({name}) => (name)))}
                            </span>
                        )}
                        {props.countries && (
                            <span className="movie-card-full-country">
                                {String(props.countries?.map(({name}) => (name)))}
                            </span>
                        )}
                        <span className="movie-card-full-duration">
                            {props.movieLength ? getTimeFromMins(props.movieLength) : ''}
                        </span>
                        {props.ageRating  && (
                            <span className="movie-card-full-age">{props.ageRating}+</span>
                        )}
                    </div>
                    <div 
                        className="movie-card-full-description random-desc"  
                        onClick={() => navigate.to(`/movies-series/:${props.id}`)}
                    >
                        {!props.shortDescription && (
                            <p>{props.description}</p>
                        )}
                        {props.shortDescription && (
                            <p>{props.shortDescription}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}