import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useFetchByFilters } from '../../shared/hooks/useFetchByFilters'
import { kp } from '../../shared/hooks/useFetchMore'
import { queryForFilters } from '../../shared/constants/queries'
import { arrayOfYears } from '../../shared/constants/constants'
import { MovieCardShort } from '../movieCards/MovieCardShort'
import { Loader } from '../../components/Loader'
import './filters.css'


type Props = {
    isMovie: boolean
}
type Options = {
    value?: string,
    label?: string
}
type OptionsLS = {
    name?: string,
    slug?: string
}
type Years = {
    value?: number,
    label?: number
}

const customStyles = {
    menu: (provided: any) => ({
        ...provided,
        // minWidth: '500px',
        // maxHeight: '200px',
        overflowY: 'auto',
    }),
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'lightgray',
      padding: window.innerWidth <= 1025 ? '0px 2px' : '0px 10px',
      border: '1px solid black',
      borderRadius: '14px',
      minHeight: window.innerWidth <= 1025 ? '30px' :'38px',
      maxHeight: window.innerWidth <= 1025 ? '32px' :'38px',
      minWidth: window.innerWidth <= 426 ? '250px' :  window.innerWidth <= 1025 ? '150px' : '210px',
      maxWidth: window.innerWidth <= 426 ? '250px' : window.innerWidth <= 1025 ? '150px' : '210px',
      fontSize: window.innerWidth <= 1025 ? '14px' : '16px',
      paddingTop: 0
    }),
    option: (provided:any, state:any) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black',
      backgroundColor: state.isSelected ? 'var(--accent-color)' : state.isFocused ? 'var(--accent-color)' : 'white',
    }),
}
const customStylesForYear = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'lightgray',
      padding: window.innerWidth <= 1025 ? '0px 1px' : '0px 5px',
      border: '1px solid black',
      borderRadius: '14px',
      minHeight: window.innerWidth <= 1025 ? '30px' :'38px',
      maxHeight: window.innerWidth <= 1025 ? '32px' :'38px',
      minWidth: window.innerWidth <= 1025 ? '90px' : '120px',
      maxWidth:  window.innerWidth <= 1025 ? '90px' : '120px',
      fontSize: window.innerWidth <= 1025 ? '12px' : '16px',
    }),
    option: (provided:any, state:any) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black',
      backgroundColor: state.isSelected ? 'var(--accent-color)' : state.isFocused ? 'var(--accent-color)' : 'white',
    }),
}
const customStylesForSort = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'lightgray',
      padding: window.innerWidth <= 1025 ? '0px 1px' : '0px 5px',
      border: '1px solid black',
      borderRadius: '14px',
      minHeight: window.innerWidth <= 1025 ? '30px' :'38px',
      maxHeight: window.innerWidth <= 1025 ? '32px' :'38px',
      minWidth: window.innerWidth <= 1025 ? '120px' : '130px',
      maxWidth:  window.innerWidth <= 1025 ? '120px' : '130px',
      fontSize: window.innerWidth <= 1025 ? '12px' : '16px',
    }),
    option: (provided:any, state:any) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black',
      backgroundColor: state.isSelected ? 'var(--accent-color)' : state.isFocused ? 'var(--accent-color)' : 'white',
    }),
}

export const Filters  = (props: Props) => {

    const [optionsGenres, setOptionsGenres] = useState<Options[]>([])
    const [optionsCountries, setOptionsCountries] = useState<Options[]>([])
    const [selectedCountry, setSelectedCountry] = useState<string>()
    const [selectedGenre, setSelectedGenre] = useState<string>()
    const [yearsFrom, setYearsFrom] = useState<number>()
    const [yearsTo, setYearsTo] = useState<number>()
    const [sortByOption, setSortByOption] = useState<string>()
    const [isVisible, setIsVisible] = useState<boolean>(false)

    

    const years: Years[] = arrayOfYears.map((year) => ({
        value: year,
        label: year,
    }))

    const sortBy: Options[] = [{value: 'rating.imdb', label: 'рейтингу'}, {value: 'year', label: 'году'}]

    const { data: filteredMoviesList, 
            isError, 
            error, 
            isLoading,
            isNoData, 
            fetchMore, 
            limitFetch,
            letsFetch,
            clearFilters } = useFetchByFilters({query: queryForFilters, 
                                            limitForQuery: 10, 
                                            genre: selectedGenre, 
                                            country: selectedCountry, 
                                            isMovie: props.isMovie,
                                            yearFrom: yearsFrom, 
                                            yearTo: yearsTo,
                                            sortBy: sortByOption})

    

    const getGenresAndCountries = async () => {
        const { data: genresList, 
                error: errorGenresList, 
                message: messageGenresList } = await kp.movie.getPossibleValuesByField('genres.name',)
        const { data: countriesList, 
                error: errorCountriesList, 
                message: messageCountriesList } = await kp.movie.getPossibleValuesByField('countries.name',)

        if (countriesList) {
            const countries = countriesList.map((country) => ({
                value: country.slug,
                label: country.name,
            }));
            setOptionsCountries(countries)
            console.log('COUNTRIES ', countriesList)
            localStorage.setItem('country', JSON.stringify(countriesList))
          }
        if (genresList) {
            console.log('GENRES ', genresList)
            const genres: Options[] = genresList.map((genre) => ({
                value: genre.slug,
                label: genre.name,
            }));
            setOptionsGenres(genres)
            localStorage.setItem('genres', JSON.stringify(genresList))
        }
        if (errorGenresList) console.log(errorGenresList, messageGenresList)
        if (errorCountriesList) console.log(errorCountriesList, messageCountriesList)
    }

    const handleResize = () => {
        if (window.innerWidth < 769) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      };
    
      useEffect(() => {
        handleResize(); 
        window.addEventListener('resize', handleResize); 
    
        return () => {
          window.removeEventListener('resize', handleResize); 
        };
      }, []);

    useEffect(() => {
        const storageDataCountries: OptionsLS[] = JSON.parse(localStorage.getItem('country') || '[]')
        const storageDataGenres: OptionsLS[] = JSON.parse(localStorage.getItem('genres') || '[]')
        if (storageDataCountries.length !== 0) {
            const countries = storageDataCountries.map((country) => ({
                value: country.slug,
                label: country.name,
            }))
            setOptionsCountries(countries)
        }

        if (storageDataGenres.length !== 0) {
            const genres = storageDataGenres.map((genre) => ({
                value: genre.slug,
                label: genre.name,
            }))
            setOptionsGenres(genres)
        }
            
        if (storageDataCountries.length === 0 && storageDataGenres.length === 0) {
            getGenresAndCountries()
        }

    }, [])

    console.log('SELECTED FILTERS ', selectedCountry, selectedGenre, yearsFrom, yearsTo, sortByOption)
    if (isError) console.error('FILTERED DATA FETCH ERROR', error)
  
    return (
        <>
        <div className="filter-container" >
            <button className="filter-icon" onClick={() => setIsVisible(prev => !prev)}></button>
            {isVisible && 
            <div className="dropdown" style={{zIndex: '10'}}>
                <label htmlFor="dropdown-genres">Жанр: </label>
                <Select id="dropdown-genres"
                    options={optionsGenres}
                    styles={customStyles}
                    placeholder='Все жанры'
                    onChange={(e) => setSelectedGenre(e?.label)}/>
                <label htmlFor="dropdown-countries">   Страна: </label>
                <Select id="dropdown-countries" 
                    options={optionsCountries} 
                    styles={customStyles} 
                    placeholder='Все страны'
                    onChange={(e) => setSelectedCountry(e?.label)}/>
                <label htmlFor="dropdown-years-from">   Интервал c </label>
                <Select id="dropdown-years-from" 
                    options={years}
                    styles={customStylesForYear}
                    placeholder='-'
                    onChange={(e) => setYearsFrom(e?.value)} />
                <label htmlFor="dropdown-years-to">   по</label>
                <Select id="dropdown-years-to" 
                    options={years}
                    styles={customStylesForYear}
                    placeholder='-'
                    onChange={(e) => setYearsTo(e?.value)} />
                <label htmlFor="dropdown-sort">   Сортировать по</label>
                <Select id="dropdown-sort" 
                    options={sortBy}
                    styles={customStylesForSort}
                    placeholder='рейтингу'
                    onChange={(e) => setSortByOption(e?.value)} 
                    />
            </div>}
            {isVisible && <button className="filter-button" onClick={letsFetch}>Найти</button>}
            {isVisible &&  <button className="filter-button" onClick={clearFilters}>Очистить</button>}
        </div>
        <div className="movies-list">
        {filteredMoviesList && filteredMoviesList?.map((movie) => (
           <MovieCardShort 
               id={movie.id} 
               SRC={movie.poster} 
               name={movie.name} 
               shortDescription={movie.shortDescription}
               rating={movie.rating}
               year={movie.year} />
       ))} 
       <div className="arrow-area">
            {isLoading && <Loader/>}
            {isError && <div className="error-filtered-list">Ошибка получения данных.</div>}
            {isNoData && !isLoading && <div className="error-filtered-list">Попробуйте задать другие фильтры для поиска.</div>}
            {filteredMoviesList.length > 0 && <button className="arrow-down" disabled={isLoading || limitFetch >= 100 || filteredMoviesList?.length < 6} onClick={fetchMore}>+</button>}
        </div>
    </div>
   </>
    )
}