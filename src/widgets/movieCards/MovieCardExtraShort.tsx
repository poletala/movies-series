import { useCustomNavigation } from "../../shared/hooks/useCustomNavigation";
import './movie-card-extra-short.css'

type PersonInMovies = {
    alternativeName?: string;
    description?: string;
    enProfession?: string;
    id?: number;
    name?: string;
    rating?: number;
}

export const MovieCardExtraShort = (props: PersonInMovies) => {
    const navigate = useCustomNavigation()

    return (
        <div className="extra-movie-container" 
            key={props.id} 
            onClick={() => navigate.to(`/movies-series/:${props.id}`)}>
                <h3 className="extra-movie-name">{props.name ? props.name : props.alternativeName}</h3>
                <p className="extra-movie-desc">{props.description ? props.description : ''}</p>
                {props.rating && 
                    <span className="extra-movie-rating">{props.rating.toFixed(1)}</span>
                }
        </div>
    )
}