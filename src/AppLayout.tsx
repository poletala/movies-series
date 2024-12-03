import { Outlet, Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { userNameSelector } from './entity/user/selectors'
import { useAppSelector } from './shared/hooks/useAppSelector'
import { userActions } from './entity/user/slice'
import './App.css'


export const AppLayout = () => {
    const [theme, setTheme] = useState('dark');
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const userName = useAppSelector(userNameSelector)
    const dispatch = useDispatch()
    const onLogot = () => {
        dispatch(userActions.clearUser())
    }

    const location = useLocation()
    const isHomePage = location.pathname === '/movies-series'
    const isSignupPage = location.pathname === '/movies-series/signup'
    const isSearchPage = location.pathname === '/movies-series/search'
    const isMoviesPage = location.pathname === '/movies-series/movies'
    const isSeriesPage = location.pathname === '/movies-series/series'

    const applyActiveStyle = (condition: boolean) => {
        return {
            color: condition ? 'var(--accent-color)' : 'var(--light-text-color)'
        }
    }
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        const root = document.getElementById('root')!
        if (newTheme === 'light') {
          root.style.setProperty('--background-color', '#d5b9b2');
          root.style.setProperty('--background-accent-color', '#a26769');
          root.style.setProperty('--accent-color', '#6d2e46');
        //   root.style.setProperty('--text-color', '#0d1b2a');
        } else {
            root.style.setProperty('--background-color', '#16181E');
            root.style.setProperty('--background-accent-color', '#21242D');
            root.style.setProperty('--accent-color', '#00B9AE');
            root.style.setProperty('--text-color', '#fff');
        }
    };
    const searchMovieLS: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setTimeout(() => {
            localStorage.setItem('search', e.target.value) 
            console.log('SEARCH MOVIE ', e.target.value)
        }, 3000);
        
    } 
    const handleResize = () => {
        if (window.innerWidth < 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
    
      useEffect(() => {
        handleResize(); 
        window.addEventListener('resize', handleResize); 
    
        return () => {
          window.removeEventListener('resize', handleResize); 
        };
      }, []);
    return (
        <>
            <header className="header-menu">
                <div className="header-menu-elements">
                    <div className="logo-container">
                    <Link to="/movies-series/" style={applyActiveStyle(isHomePage)} className="logo"></Link>
                    </div>
                    {!isVisible && <Link to="/movies-series/movies" style={applyActiveStyle(isMoviesPage)} className="element-nav">Фильмы</Link>}
                    {!isVisible && <Link to="/movies-series/series" style={applyActiveStyle(isSeriesPage)} className="element-nav">Сериалы</Link>}
                    {isVisible && <button className="dropdown-menu" onClick={() => setIsOpen(prev => !prev)}></button>}
                    {isOpen && <div className="dropdown-menu-open">
                        <Link to="/movies-series/movies" className="element-nav">Фильмы</Link>
                        <Link to="/movies-series/series" className="element-nav">Сериалы</Link>
                    </div>}
                    <div className="search">
                        <input type="text" placeholder="Поиск"  maxLength={25} onChange={searchMovieLS} className="search-movie-field"/> 
                        <Link to="/movies-series/search" style={applyActiveStyle(isSearchPage)} className="search-icon element-nav"></Link>
                    </div>
                    
                </div>
                <div className="header-menu-login">
                    {userName ? (<>
                    <Link to="/movies-series/mylist" className="element-nav my-list-nav"></Link>
                    <div className="element-nav user-name" style={{fontSize: '15px'}}>{userName}</div>
                    <div onClick={onLogot} className="element-nav logout-btn"></div></>)
                     : <Link to="/movies-series/signup"  style={applyActiveStyle(isSignupPage)} className="element-nav login-title">Войти</Link>}
                </div>
                <button className="toggle-theme element-nav" onClick={toggleTheme}></button>
            </header>
            <Outlet />
        </>
    )
}