import { Routes, Route} from 'react-router-dom'
import { SearchPage } from './pages'
import { HomePage } from './pages'
import { AppLayout } from './AppLayout'
import { SignupPage } from './pages'
// import { ErrorPage } from './Pages/ErrorPage/ErrorPage'
import { MoviesPage } from './pages'
import { SeriesPage } from './pages'
import { AboutMoviePage } from './pages'
import { MyListPage } from './pages'
import './App.css'
import './styles/fonts/fonts.css'

function App() {

  return (
    <>
    <Routes>
        <Route element={<AppLayout />}>
          <Route path="/movies-series/" element={<HomePage />} />
          <Route path="/movies-series/search" element={<SearchPage />} />
          <Route path="/movies-series/signup" element={<SignupPage />} />
          <Route path="/movies-series/movies" element={<MoviesPage />} />
          <Route path="/movies-series/:id" element={<AboutMoviePage />} />
          <Route path="/movies-series/series" element={<SeriesPage />} />
          <Route path="/movies-series/mylist" element={<MyListPage />} />
          <Route path="*" element={<HomePage />} />
        </Route> 
      </Routes>
    </>
  )
}

export default App
