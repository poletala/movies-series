import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useFetchByFilters } from '../../shared/hooks/useFetchByFilters'
import { kp } from '../../shared/hooks/useFetchMore'
import { queryForFilters } from '../../shared/constants/queries'
import { MovieCardShort } from '../movieCards/movieCardShort/MovieCardShort'
import { Loader } from '../../components/loader/Loader'
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
const isTablet = window.innerWidth <= 1025
const isPhone = window.innerWidth <= 426
//стили для Селект
const customStyles = {
    menu: (provided: any) => ({
        ...provided,
        overflowY: 'auto',
    }),
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'lightgray',
      padding: isTablet ? '0px 2px' : '0px 10px',
      border: '1px solid white',
      borderRadius: '14px',
      minHeight: isTablet ? '30px' :'38px',
      maxHeight: isTablet ? '32px' :'38px',
      minWidth: isPhone ? '250px' :  isTablet ? '150px' : '210px',
      maxWidth: isPhone ? '250px' : isTablet ? '150px' : '210px',
      fontSize: isTablet ? '14px' : '16px',
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
      padding: isTablet ? '0px 1px' : '0px 5px',
      border: '1px solid white',
      borderRadius: '14px',
      minHeight: isTablet ? '30px' :'38px',
      maxHeight: isTablet ? '32px' :'38px',
      minWidth: isTablet ? '90px' : '120px',
      maxWidth: isTablet ? '90px' : '120px',
      fontSize: isTablet ? '12px' : '16px',
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
      padding: isTablet ? '0px 1px' : '0px 5px',
      border: '1px solid white',
      borderRadius: '14px',
      minHeight: isTablet ? '30px' :'38px',
      maxHeight: isTablet ? '32px' :'38px',
      minWidth: isTablet ? '120px' : '130px',
      maxWidth: isTablet ? '120px' : '130px',
      fontSize: isTablet ? '12px' : '16px',
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
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined)
    const [selectedGenre, setSelectedGenre] = useState<string>()
    const [yearsFrom, setYearsFrom] = useState<number>()
    const [yearsTo, setYearsTo] = useState<number>()
    const [sortByOption, setSortByOption] = useState<string>()
    const [isVisible, setIsVisible] = useState<boolean>(false)

    //устаналиваем опцию Годы для Селект
    const startYear = 1924;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
    }
    const yearsForFilters: Years[] = years.map((year) => ({
        value: year,
        label: year,
    }))

    const sortBy: Options[] = [{value: 'rating.imdb', label: 'рейтингу'}, {value: 'year', label: 'году'}]

    //Используем кастомный хук useFetchByFilters для поиса фильмов по заданным фильтрам
    const { data: filteredMoviesList, 
            isError, 
            error, 
            isLoading,
            isNoData, 
            fetchMore, 
            limitFetch,
            letsFetch,
            clearFilters } = useFetchByFilters({ query: queryForFilters, 
                                            limitForQuery: 10, 
                                            genre: selectedGenre, 
                                            country: selectedCountry, 
                                            isMovie: props.isMovie,
                                            yearFrom: yearsFrom, 
                                            yearTo: yearsTo,
                                            sortBy: sortByOption })

    //Функция поиска всех жанров и стран
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
            // console.log('COUNTRIES ', countriesList)
            //сохраняем все возможные страны в локалсторэдж
            localStorage.setItem('country', JSON.stringify(countriesList))
          }
        if (genresList) {
            console.log('GENRES ', genresList)
            const genres: Options[] = genresList.map((genre) => ({
                value: genre.slug,
                label: genre.name,
            }));
            setOptionsGenres(genres)
            //сохраняем все возможные жанры в локалсторэдж
            localStorage.setItem('genres', JSON.stringify(genresList))
        }
        if (errorGenresList) console.log(errorGenresList, messageGenresList)
        if (errorCountriesList) console.log(errorCountriesList, messageCountriesList)
    }
    //при ширине экрана менее 769 пикселей делаем фильтрацию невидимой (только иконка)
    const handleResize = () => {
        if (window.innerWidth < 769) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      };
    //при рендеринге определяем ширину экрана один раз
      useEffect(() => {
        handleResize(); 
        window.addEventListener('resize', handleResize); 
        return () => {
          window.removeEventListener('resize', handleResize); 
        };
      }, []);
    //Проверяем наличие сохраненных жанров и стран в локалсторэдж
    //если их нет, запускаем функцию загрузки
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
    //Удаление фильтров для поиска 
    const clearFiltersInputs = () => {
        clearFilters()
        setSelectedCountry(undefined)
        setSelectedGenre('')
        setYearsFrom(undefined)
        setYearsTo(undefined)
        setSortByOption('')
        setIsVisible(false);
        setTimeout(() => {
            setIsVisible(true);
        }, 300);
    }

    // console.log('SELECTED FILTERS ', selectedCountry, selectedGenre, yearsFrom, yearsTo, sortByOption)
    if (isError) console.error('FILTERED DATA FETCH ERROR', error)
  
    return (
        <>
        <div className="filter-container">
            <button className="filter-icon" onClick={() => setIsVisible(prev => !prev)}></button>
            {isVisible && (
            <div className="dropdown" style={{ zIndex: '10' }}>
                <label htmlFor="dropdown-genres">Жанр: </label>
                <Select id="dropdown-genres"
                    options={optionsGenres}
                    styles={customStyles}
                    placeholder="Все жанры"
                    onChange={(e) => setSelectedGenre(e?.label)}
                />
                <label htmlFor="dropdown-countries">   Страна: </label>
                <Select id="dropdown-countries" 
                    options={optionsCountries} 
                    styles={customStyles} 
                    placeholder="Все страны"
                    onChange={(e) => setSelectedCountry(e?.label)}
                />
                <label htmlFor="dropdown-years-from">   Интервал c </label>
                <Select id="dropdown-years-from" 
                    options={yearsForFilters}
                    styles={customStylesForYear}
                    placeholder="-"
                    onChange={(e) => setYearsFrom(e?.value)} 
                />
                <label htmlFor="dropdown-years-to">   по</label>
                <Select id="dropdown-years-to" 
                    options={yearsForFilters}
                    styles={customStylesForYear}
                    placeholder="-"
                    onChange={(e) => setYearsTo(e?.value)} 
                />
                <label htmlFor="dropdown-sort">   Сортировать по</label>
                <Select id="dropdown-sort" 
                    options={sortBy}
                    styles={customStylesForSort}
                    placeholder="рейтингу"
                    onChange={(e) => setSortByOption(e?.value)} 
                />
            </div>
            )}
            {isVisible && (
                <button 
                    className="filter-button" 
                    onClick={letsFetch}
                >
                    Найти
                </button>
            )}
            {isVisible && (
                <button 
                    className="filter-button" 
                    onClick={clearFiltersInputs}
                >
                    Очистить
                </button>
            )}
        </div>
        <div className="movies-list">
        {filteredMoviesList && (
            filteredMoviesList?.map((movie) => (
                <MovieCardShort 
                    id={movie.id} 
                    SRC={movie.poster} 
                    name={movie.name} 
                    shortDescription={movie.shortDescription}
                    rating={movie.rating}
                    year={movie.year} 
                />
            ))
        )} 
       <div className="arrow-area">
            {isLoading && (<Loader/>)}
            {isError && (
                <div className="error-filtered-list">
                    Ошибка получения данных.
                </div>
            )}
            {isNoData && 
                !isLoading && (
                <div className="error-filtered-list">
                    Попробуйте задать другие фильтры для поиска.
                </div>
            )}
            {filteredMoviesList.length > 0 && (
                <button 
                    className="arrow-down" 
                    disabled={isLoading || limitFetch >= 100 || filteredMoviesList?.length < 6} 
                    onClick={fetchMore}
                >
                    +
                </button>
            )}
        </div>
    </div>
   </>
    )
}