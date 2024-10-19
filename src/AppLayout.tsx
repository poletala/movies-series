import { Outlet, Link, useLocation } from "react-router-dom"

import { useDispatch } from 'react-redux'
import { userNameSelector } from './entity/user/selectors'
import { useAppSelector } from './shared/hooks/useAppSelector'
import './App.css'
import { userActions } from './entity/user/slice'


export const AppLayout = () => {
    const userName = useAppSelector(userNameSelector)
    const dispatch = useDispatch()
    const onLogot = () => {
        dispatch(userActions.clearUser())
    }

    const location = useLocation()
    const isHomePage = location.pathname === '/home'
    const isSignupPage = location.pathname === '/signup'
    const isSearchPage = location.pathname === '/search'
    const isMoviesPage = location.pathname === '/movies'
    const isSeriesPage = location.pathname === '/series'

    const applyActiveStyle = (condition: boolean) => (
        {color: condition ? 'var(--accent-color)' : 'var(--light-text-color)'}
    )
    return (
        <>
            <header className="header-menu">
                <div className='header-menu-elements'>
                    <Link to="/" style={applyActiveStyle(isHomePage)} className="logo"></Link>
                    <Link to="/movies" style={applyActiveStyle(isMoviesPage)} className="element-nav">Фильмы</Link>
                    <Link to="/series" style={applyActiveStyle(isSeriesPage)} className="element-nav">Сериалы</Link>
                    <div className="search">
                        <input type="text" placeholder="Поиск"  maxLength={25}/> 
                        <Link to="/search" style={applyActiveStyle(isSearchPage)} className='search-icon'></Link>
                    </div>
                </div>
                <div className='header-menu-login'>
                    {userName ? (<><div className="element-nav user-name" style={{fontSize: '15px'}}>{userName}</div><div onClick={onLogot} className="element-nav logout-btn"></div></>)
                     : <Link to="/signup"  style={applyActiveStyle(isSignupPage)} className="element-nav">Войти</Link>}
                </div>
            </header>
            <Outlet />
        </>

       
    )
}

  
