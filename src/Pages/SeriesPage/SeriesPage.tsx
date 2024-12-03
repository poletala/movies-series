import { useFetchMore } from '../../shared/hooks/useFetchMore'
import { queryForTopSeries } from '../../shared/constants/queries'
import { Loader } from '../../components/Loader'
import { MovieCardShort } from '../../widgets/movieCards/MovieCardShort'
import { Filters } from '../../widgets/filters/Filters'
import { ScrollToTop } from '../../components/ScrollToTop'

export const SeriesPage = () => {

    const {
        data: seriesList,
        error: errorSeriesList,
        isError: isErrorSeriesList,
        isLoading: isLoadingSeries,
        fetchMore: fetchMoreSeries,
        limitFetch: limitFetchSeries} = useFetchMore({ query: queryForTopSeries, limitForQuery: 10 });
    console.log('Error series page ', errorSeriesList)

    return (
        <> 
        <div className="movies-list-page">
            {seriesList.length > 0 &&
            <Filters isMovie = {false}/>}
            {seriesList.length > 0 &&  <h2 className="header-movies-list">ТОП сериалов <span>IMDb</span></h2>}
                <div className="movies-list">
                    {(seriesList && !isErrorSeriesList) && seriesList?.map((series) => (
                        <MovieCardShort
                            key={series.id}
                            id={series.id}
                            SRC={series.poster}
                            name={series.name}
                            shortDescription={series.shortDescription}
                            rating={series.rating}
                            year={series.year}/>
                    ))}
                </div>
                <div className="arrow-area">
                    {isLoadingSeries && <Loader/>}
                    {isErrorSeriesList && !isLoadingSeries && <div>Ошибка получения данных.</div>}
                    {seriesList.length > 0 &&
                    <button className="arrow-down" disabled={isLoadingSeries || limitFetchSeries >= 100} onClick={fetchMoreSeries}>+</button>}
                </div>
        </div>
        <ScrollToTop />
        </>
    )
}