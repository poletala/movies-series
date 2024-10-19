
import './App.css'
import './styles/fonts/fonts.css'
import { Routes, Route} from 'react-router-dom'
import { SearchPage } from './Pages/SearchPage/SearchPage'
import { HomePage } from './Pages/HomePage/HomePage'
import { AppLayout } from './AppLayout'
import { SignupPage } from './Pages/SignupPage/SignupPage'
import { ErrorPage } from './Pages/ErrorPage/ErrorPage'
import { MoviesPage } from './Pages/MoviesPage/MoviesPage'
import { SeriesPage } from './Pages/SeriesPage/SeriesPage'

function App() {


  return (
    <>
    <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route> 
      </Routes>
    </>
  )
}

export default App
