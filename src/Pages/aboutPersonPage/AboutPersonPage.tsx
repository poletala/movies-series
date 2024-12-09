import { KinopoiskDev, Person } from "@openmoviedb/kinopoiskdev_client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_KEYS } from "../../shared/hooks/useFetchMore";
import { ScrollToTop } from "../../components/ScrollToTop";
import { Loader } from "../../components/Loader";

type Params = {
    id: string | undefined;
}

export const AboutPersonPage = () => {
    const { id } = useParams<Params>();
    const [personInfo, setPersonInfo] = useState<Person>()
    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    let kp = new KinopoiskDev(API_KEYS[0])

    useEffect(() => {
        const getPersonById = async () => {

            const { data, error, message } = await kp.person.getById(Number(id));
    
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
                for (let i=0; i < API_KEYS.length; i++) {
                    kp = new KinopoiskDev(API_KEYS[i++]) 
                }
                console.log('RERSON ERROR ', error)
                return
            }}
        id ? getPersonById() : console.log('Person not found')
    },[])

    console.log('PERSON BY ID:', id, 'INFO ABOUT MOVIE BY ID ', personInfo)
    return (
        <>
        {isLoading && !isError && <div className="nodata"><Loader/></div>}
        {!isLoading && !isError && 
            <div>
                <p>{personInfo?.name}</p>
            </div>}
        {isError && <div className="nodata">Ошибка получения данных.</div>}
        <ScrollToTop />
        </>
    )
}