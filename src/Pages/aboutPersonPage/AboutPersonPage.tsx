import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KinopoiskDev, Person } from "@openmoviedb/kinopoiskdev_client";
import Slider from "react-slick";
import { ScrollToTop } from "../../components/ScrollToTop";
import { Loader } from "../../components/Loader";
import { MovieCardExtraShort } from "../../widgets/movieCards/MovieCardExtraShort";
import { FactsAboutPerson } from "../../components/FactsAboutPerson";
import { API_KEYS } from "../../shared/hooks/useFetchMore";
import './aboutPersonPage.css'

type Params = {
    id: string | undefined;
}

export const AboutPersonPage = () => {

    const { id } = useParams<Params>();
    const [personInfo, setPersonInfo] = useState<Person>()
    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [profession, setProfession] = useState<string>('actor')

    let kp = new KinopoiskDev(API_KEYS[0])

    //Функция поиска информации о человеке по айди
    useEffect(() => {
        const getPersonById = async () => {

            const { data, error, message } = await kp.person.getById(Number(id?.slice(1)));
    
            if(data) {
                setPersonInfo(data)
                setIsError(false)
                setIsLoading(false)
                console.log('PERSON BY ID ', data)
            }
            if (error) {
                console.log(error, message);
                setIsError(true)
                setIsLoading(false)
                //пр ошибке пробуем сменить апи ключ
                for (let i=0; i < API_KEYS.length; i++) {
                    kp = new KinopoiskDev(API_KEYS[i++]) 
                }
                console.log('RERSON ERROR ', error)
                return
            }}

        id ? getPersonById() : console.log('Person not found')
    },[])

    //Функция изменения формата даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    //Настройки для Слайдера
    const settings = {
        dots: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true
    }
    //Функция удаления задваивания https в url 
    function cleanUrl(url: any) {
        while ((url.match(/https:/g) || []).length > 1) {
            url = url.replace("https:", "");
        }
        return url;
    }

    console.log('PERSON BY ID:', id, 'INFO ABOUT PERSON BY ID ', personInfo)
    
    return (
        <>
        {isLoading && !isError && <div className="nodata"><Loader/></div>}
        {!isLoading && !isError && personInfo && 
            <div className="person-container">
                <div className="person-poster" 
                    style={{backgroundImage: personInfo?.photo ? `url(${cleanUrl(personInfo?.photo)})` : ''}}></div>
                <div className="person-info">
                    <p className="person-name">{personInfo?.name}</p>
                    <p className="person-name-eng">{personInfo?.enName}</p>
                    {!personInfo?.death && 
                        <p>
                            <span>Возраст: </span>
                            {personInfo?.age ? personInfo?.age : 'Нет информации.'}
                        </p>
                    }
                    {personInfo?.death && 
                        <p>
                            <span>Дожил до возраста: </span>
                            {personInfo?.age}
                        </p>
                    }
                    <p>
                        <span>Дата рождения: </span>
                        {personInfo?.birthday ? formatDate(personInfo?.birthday) : 'Нет информации.'}
                    </p>
                    <p>
                        <span>Место рождения: </span>
                        {personInfo!.birthPlace! && personInfo!.birthPlace!.length > 0 ? personInfo?.birthPlace?.map(place => place.value).join(', ') : 'Нет информации.'}
                    </p>
                    <p>
                        <span>Рост: </span>
                        {personInfo?.growth ? personInfo?.growth : 'Нет информации.'}
                    </p>
                    <div className="slider-facts">
                        <Slider {...settings}>
                            {personInfo?.facts && 
                                personInfo?.facts.map((fact) => 
                                <FactsAboutPerson fact={fact.value}/>)}
                        </Slider>
                    </div>
                </div>
                </div>}
                {personInfo?.movies && <div className="movies-person">
                    <div className="movies-person-info">
                        <button type="button" 
                                className="person-as-actor" 
                                onClick={() => setProfession('actor')}
                                style={{
                                    backgroundColor: profession === 'actor' ? 'var(--accent-color)' : 'var(--background-accent-color)',
                                }}
                                >
                                    Актер
                        </button>
                        <button type="button" 
                                className="person-as-director" 
                                onClick={() => setProfession('director')}
                                style={{
                                    backgroundColor: profession === 'director' ? 'var(--accent-color)' : 'var(--background-accent-color)',
                                }}
                                >
                                    Режиссер
                        </button>
                        <button type="button" 
                                className="person-as-producer" 
                                onClick={() => setProfession('producer')}
                                style={{
                                    backgroundColor: profession === 'producer' ? 'var(--accent-color)' : 'var(--background-accent-color)',
                                }}
                                >
                                    Продюсер
                        </button>
                        <button type="button" 
                                className="person-as-writer" 
                                onClick={() => setProfession('writer')}
                                style={{
                                    backgroundColor: profession === 'writer' ? 'var(--accent-color)' : 'var(--background-accent-color)',
                                }}
                                >
                                    Сценарист
                        </button>
                        <button type="button" 
                                className="person-as-cameo" 
                                onClick={() => setProfession('cameo')}
                                style={{
                                    backgroundColor: profession === 'cameo' ? 'var(--accent-color)' : 'var(--background-accent-color)',
                                }}
                                >
                                    Камео
                        </button>
                    </div>
                    {personInfo?.movies && 
                        personInfo?.movies.sort((a, b) => (b.rating  ?? 0) - (a.rating  ?? 0)).map((movie) => (
                            profession === movie.enProfession &&
                                <MovieCardExtraShort
                                // key={movie.id}
                                    alternativeName={movie.alternativeName}
                                    description={movie.description}
                                    enProfession={movie.enProfession}
                                    id={movie.id}
                                    name={movie.name}
                                    rating={movie.rating} />
                    ))}
                </div>}
        {isError && <div className="nodata">Ошибка получения данных.</div>}
        <ScrollToTop />
        </>
    )
}