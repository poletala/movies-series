import { Outlet, Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userNameSelector } from './entity/user/selectors'
import { useAppSelector } from './shared/hooks/useAppSelector'
import { userActions } from './entity/user/slice'
import './App.css'

export const AppLayout = () => {
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

    const searchMovieLS: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setTimeout(() => {
            localStorage.setItem('search', e.target.value) 
            console.log('SEARCH MOVIE ', e.target.value)
        }, 3000);
        
    } 
    return (
        <>
            <header className="header-menu">
                <div className="header-menu-elements">
                    <Link to="/movies-series/" style={applyActiveStyle(isHomePage)} className="logo"></Link>
                    <Link to="/movies-series/movies" style={applyActiveStyle(isMoviesPage)} className="element-nav">Фильмы</Link>
                    <Link to="/movies-series/series" style={applyActiveStyle(isSeriesPage)} className="element-nav">Сериалы</Link>
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
            </header>
            <Outlet />
        </>
    )
}