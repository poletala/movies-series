import { Outlet, Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

import { userNameSelector } from './entity/user/selectors'
import { useCustomNavigation } from './shared/hooks/useCustomNavigation'
import { useAppSelector } from './shared/hooks/useAppSelector'
import { userActions } from './entity/user/slice'
import { darkThemeIcon, lightThemeIcon } from './assets'

import './App.css'

export const AppLayout = () => {
    const [theme, setTheme] = useState('dark');
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [inputSearchValue, setInputSearchValue] = useState<string>('')
    const navigate = useCustomNavigation()

    const userName = useAppSelector(userNameSelector)
    const dispatch = useDispatch()
    const onLogot = () => {
        dispatch(userActions.clearUser())
    }
    const routes = {
        home: '/movies-series',
        signup: '/movies-series/signup',
        search: '/movies-series/search',
        movies: '/movies-series/movies',
        series: '/movies-series/series',
    };
    const location = useLocation()
    const isHomePage = location.pathname === routes.home
    const isSignupPage = location.pathname === routes.signup
    const isSearchPage = location.pathname === routes.search
    const isMoviesPage = location.pathname === routes.movies
    const isSeriesPage = location.pathname === routes.series

    //Применение стиля для активной вкладки
    const applyActiveStyle = (condition: boolean) => {
        return {
            color: condition ? 'var(--accent-color)' : 'var(--light-text-color)'
        }
    }
    //Переключение темы
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        const root = document.getElementById('root')!
        if (newTheme === 'light') {
          root.style.setProperty('--background-color', '#d5b9b2');
          root.style.setProperty('--background-accent-color', '#a26769');
          root.style.setProperty('--accent-color', '#6d2e46');
          root.style.setProperty('--grey-text-color', '#6d2e46');
          (document.querySelector('.toggle-theme')! as HTMLElement).style.backgroundImage = `url(${darkThemeIcon})`
        } else {
            root.style.setProperty('--background-color', '#16181E');
            root.style.setProperty('--background-accent-color', '#21242D');
            root.style.setProperty('--accent-color', '#00B9AE');
            root.style.setProperty('--text-color', '#fff');
            root.style.setProperty('--grey-text-color', '#666a76');
            (document.querySelector('.toggle-theme')! as HTMLElement).style.backgroundImage = `url(${lightThemeIcon})`
        }
    };
    //Сохранение введенного фильма для поиска в локалсторэдж
    const searchMovieLS: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setTimeout(() => {
            setInputSearchValue(e.target.value)
            localStorage.setItem('search', inputSearchValue) 
            // console.log('SEARCH MOVIE ', e.target.value)
        }, 500);
    } 
    //Поиск фильма при нажатии клавиши энтер на поле ввода
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setTimeout(() => {
                navigate.to(`/movies-series/search`)
            }, 2000)
        }
    };
    //При ширине экрана менее 500 пикселей показывать меню для телефоновn
    const handleResize = () => {
        if (window.innerWidth < 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
    };
    //Проверка ширины экраны при рендеринге
    useEffect(() => {
        handleResize(); 
        window.addEventListener('resize', handleResize); 
        return () => {
          window.removeEventListener('resize', handleResize); 
        };
    }, []);
    //Открытие окна меню
    const openMenu = () => {
        setIsOpen(true);
        setTimeout(() => {
            setIsOpen(false);
        }, 2000)
    }

    return (
        <>
            <header className="header-menu">
                <div className="header-menu-elements">
                    {!isVisible && (
                        <div className="logo-container">
                            <Link to="/movies-series/" 
                                style={applyActiveStyle(isHomePage)} 
                                className="logo"
                            >
                            </Link>
                        </div>
                    )}
                    {!isVisible && (
                        <Link to="/movies-series/movies" 
                            style={applyActiveStyle(isMoviesPage)} 
                            className="element-nav"
                        >
                            Фильмы
                        </Link>
                    )}
                    {!isVisible && (
                        <Link to="/movies-series/series" 
                            style={applyActiveStyle(isSeriesPage)} 
                            className="element-nav"
                        >
                            Сериалы
                        </Link>
                    )}
                    {isVisible && (
                        <button 
                            className="dropdown-menu" 
                            onClick={openMenu}
                        >
                        </button>
                    )}
                    {isOpen && (
                        <div className="dropdown-menu-open">
                            <Link to="/movies-series/" 
                                className="element-nav"
                            >
                                Главная
                            </Link>
                            <Link to="/movies-series/movies" 
                                className="element-nav"
                            >
                                Фильмы
                            </Link>
                            <Link to="/movies-series/series" 
                                className="element-nav"
                            >
                                Сериалы
                            </Link>
                        </div>
                    )}
                    <div className="search">
                        <input 
                            type="text" 
                            placeholder="Поиск"  
                            maxLength={25} 
                            onChange={searchMovieLS} 
                            onKeyDown={handleKeyDown}
                            className="search-movie-field"
                        /> 
                        <Link to="/movies-series/search" 
                            style={applyActiveStyle(isSearchPage)} 
                            className="search-icon element-nav"
                        >
                        </Link>
                    </div> 
                </div>
                <div className="header-menu-login">
                    {userName ? (
                        <>
                            <Link to="/movies-series/mylist" 
                                className="element-nav my-list-nav"
                            >
                            </Link>
                            <div className="element-nav user-name" style={{fontSize: '15px'}}>
                                {userName}
                            </div>
                            <div onClick={onLogot} className="element-nav logout-btn"></div>
                        </>
                    )
                    :   <Link to="/movies-series/signup"  
                            style={applyActiveStyle(isSignupPage)} 
                            className="element-nav login-title"
                        >
                            Войти
                        </Link>}
                </div>
                <button className="toggle-theme element-nav" onClick={toggleTheme}></button>
            </header>
            <Outlet />
        </>
    )
}