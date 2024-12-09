import { useCustomNavigation } from '../shared/hooks/useCustomNavigation'
import './index.css'

type CardImageAndDescription = {
    id?: number,
    photo?: string,
    description1?: string,
    description2?: string,
    onClick?: () => void
}

export const ImageAndDescriptionCard = (props: CardImageAndDescription) => {
    const navigate = useCustomNavigation()

    return (
        <div className="card-box" key={props.id} onClick={() => navigate.to(`/movies-series/person/${props.id}`)}>
            <div className="card-box-img" style={{backgroundImage: `url(${props.photo})`}}></div>
            <p className="card-box-description-1">{props.description1}</p>
            <p className="card-box-description-2">{props.description2}</p>
        </div>
    )
}