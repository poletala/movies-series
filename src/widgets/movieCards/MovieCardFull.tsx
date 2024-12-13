import { Rating, ItemName, ShortImage, PersonInMovie, LinkedMovie, SeasonInfo } from '@openmoviedb/kinopoiskdev_client'
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { ImageAndDescriptionCard } from '../../components/ImageAndDescriptionCard'
import { MovieCardShort } from './MovieCardShort'
import './movie-card-full.css'


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
    description?: string;
    shortDescription?: string;
    SRC?: ShortImage;
    backdrop?: ShortImage;
    persons?: Array<PersonInMovie>;
    similarMovies?: Array<LinkedMovie>;
    seasonsInfo?:SeasonInfo[];
    status?: string;
    isSeries?: boolean;
}

export const MovieCardFull = (props: Props) => {
    const detailsRef = useRef<null | HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isVisibleInMyList, setIsVisibleInMyList] = useState<boolean>(false)
 
    //Функция приведения времени в минутах в часы
    function getTimeFromMins(mins: number) {
        let hours = Math.trunc(mins/60);
        let minutes = mins % 60;
        return hours + 'ч. ' + minutes + 'м.';
    }
    //Функция перехода к деталям о фильме
    const scrollToDetails = () => {
        setIsVisible(true)
        setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300)
    };

    const addToMyListBTN = document.querySelector('.movie-card-full-btn-my-list')! as HTMLElement
    const toMyListBTN = document.querySelector('.movie-card-full-btn-in-my-list')! as HTMLElement
    let savedMoviesInLS = JSON.parse(localStorage.getItem('myList') || '[]')
    
    const movieInfo = {
        id: props.id,
        name: props.name,
        rating: props.rating?.imdb,
        year: props.year,
        SRC: props.SRC?.url
    }
    //Изменение отображения кнопок в зависимости от наличия фильма в Моем листе
    if (savedMoviesInLS.length > 0) {
        for(let i = 0; i < savedMoviesInLS.length; i++) {
            if(savedMoviesInLS[i].id === movieInfo.id) {
                addToMyListBTN ? addToMyListBTN.style.display = 'none' : console.log('no add-to-my-list btn')
                // addToMyListBTN.style.display = 'none'
                toMyListBTN ? toMyListBTN.style.display = 'block' : console.log('no to-my-list btn')
            }
        }
    }
    console.log('Movie Info ', movieInfo)

    //Функция добавления фильма с Мой лист
   function addToMyList() {
    setIsVisibleInMyList(true)
    console.log('Saved movies', savedMoviesInLS)
    if (savedMoviesInLS.length > 0) {
        for(let i = 0; i < savedMoviesInLS.length; i++) {
            if(savedMoviesInLS[i].id === movieInfo.id) {
                savedMoviesInLS.splice(i, 1)
                break
            }
        }
        savedMoviesInLS.push(movieInfo)
    }
    if(savedMoviesInLS.length === 0) {
        savedMoviesInLS = [movieInfo]
    }

    localStorage.setItem('myList', JSON.stringify(savedMoviesInLS))
    addToMyListBTN ? addToMyListBTN.style.display = 'none' : console.log('no add-to-my-list btn')
    toMyListBTN ? toMyListBTN.style.display = 'block' : console.log('no to-my-list btn')
   }

   //Изменяем очередность состава, работающего над фильмом, исходя из должности
    const directors = props.persons?.filter(person => person.enProfession === 'director') || [];
    const writers = props.persons?.filter(person => person.enProfession === 'writer') || [];
    const producers = props.persons?.filter(person => person.enProfession === 'producer') || [];
    const combinedPersons = directors.concat(producers, writers);

    return (
        <>
            <div className="movie-card-full" 
                key={props.id} 
                style={{backgroundImage: `url(${props.backdrop?.url})`, 
                        padding: !props.backdrop?.url && innerWidth < 500 ? '83% 5% 2% 10%' : ''}}>
                    {!props.backdrop?.url && 
                        <div className="movie-card-full-poster" 
                            style={{backgroundImage: `url(${props.SRC?.url})`}}>
                        </div>
                    }
                    <div className="movie-card-full-info">
                        <div className="movie-card-full-name">
                            <h2>{props.name}</h2>
                            <h4>{props.enName}</h4> 
                        </div>
                    <div className="movie-card-full-details">
                        <span className="movie-card-full-rating">{props.rating?.imdb}</span>
                        <span className="movie-card-full-year">{props.year}</span>
                        <span className="movie-card-full-genre">
                            {String(props.genres?.map(genre => genre.name).join(', '))}
                        </span>
                        <span className="movie-card-full-country">
                            {String(props.countries?.map(country => country.name).join(', '))}
                        </span>
                        <span className="movie-card-full-duration">
                            {props.movieLength ? getTimeFromMins(props.movieLength) : ''}
                        </span>
                        {props.ageRating && 
                            <span className="movie-card-full-age">
                                {props.ageRating}
                                    +
                            </span>
                        }
                    </div>
                    <div className="movie-card-full-description">
                        <p>{props.description}</p>
                        <p>{props.isSeries && 
                            props.seasonsInfo ? `Cезонов: ${props.seasonsInfo.length} ` : ''}
                        </p>
                        <p>
                            {props.isSeries && props.status && props.status === 'completed' ? 'Заверешен' : ''}
                        </p>
                    </div>
                    <div className="movie-card-full-btns">
                        {props.persons && 
                            <button 
                                className="movie-card-full-btn-more" 
                                onClick={scrollToDetails}>
                                    Подробнее
                            </button>
                        }
                        {!isVisibleInMyList && 
                            <button 
                                className="movie-card-full-btn-my-list" 
                                onClick={addToMyList}>
                                    Буду смотреть
                            </button>
                        }
                        {isVisibleInMyList && 
                            <Link to="/movies-series/mylist" 
                            className="movie-card-full-btn-in-my-list">
                                В моём списке
                            </Link>
                        }
                    </div>
                </div>
            </div>
            {isVisible && 
                <div 
                    className="more-details-abt-movie" 
                    ref={detailsRef}>
                        <div className="full-workers">
                            {props.persons && 
                                <h3>Над фильмом работали</h3>
                            }
                            <div className="full-workers-container">
                                {props.persons && 
                                    combinedPersons?.map((person) => {
                                    if(person.enProfession === 'director' || 
                                        person.enProfession === 'writer' || 
                                        person.enProfession ===  'producer') {
                                            return ( 
                                                <ImageAndDescriptionCard 
                                                    id={person.id} 
                                                    photo={person.photo} 
                                                    description1={person.name} 
                                                    description2={person.profession.slice(0, -1)} 
                                                />
                                            )
                                        }  
                                    })
                                }
                            </div>
                        </div>
                    <div className="full-actors">
                        {props.persons &&  
                            <h3>В главных ролях</h3>
                        }
                        <div className="full-actors-container">
                            {props.persons && 
                                props.persons?.map((person) => {
                                    if(person.enProfession === 'actor') {
                                        return <ImageAndDescriptionCard 
                                            id={person.id} 
                                            photo={person.photo} 
                                            description1={person.name} 
                                            description2={person.description}
                                        />
                                    }      
                            })}
                        </div>
                    </div>
                    <div className="full-similar-films">
                        {props.similarMovies  && 
                            <h3>Похожие фильмы</h3>
                        }
                        <div className="full-similar-films-container">
                            {props.similarMovies && 
                                props.similarMovies?.map((similarMovie) => {
                                    return  <MovieCardShort 
                                        id={similarMovie.id} 
                                        SRC={similarMovie.poster} 
                                        name={similarMovie.name}
                                    />
                            })}
                        </div>
                    </div>
            </div>
            }
        </>
    )
}