import { Filter, MovieFields } from '@openmoviedb/kinopoiskdev_client';

export const queryForTopSeries: Filter<MovieFields> = {
    selectFields: ['id', 'name', 'rating', 'poster', 'year', 'top250', 'shortDescription'],
    year: '1950-2023',
    'rating.kp': '7.5-10',
    'name' : '!null',
    'top250' : '!null',
    'shortDescription' : '!null',
    'isSeries' : 'true',
    sortField: 'rating.imdb',
    sortType: '-1',
    page: 1,
    // limit: 1,
}

export const queryForTopMovies: Filter<MovieFields> = {
    selectFields: ['id', 'name', 'rating', 'poster', 'year', 'top250', 'shortDescription'],
    year: '1950-2023',
    'rating.kp': '7.5-10',
    'name' : '!null',
    'top250' : '!null',
    'shortDescription' : '!null',
    'isSeries' : 'false',
    'type' : 'movie',
    sortField: 'rating.imdb',
    sortType: '-1',
    page: 1,
    // limit: 1,
}

export  const queryForFilters: Filter<MovieFields> = {
    selectFields: ['id', 'name', 'rating', 'poster', 'year', 'shortDescription'],
    year: '1950-2023',
    'rating.kp': '3-10',
    'name' : '!null',
    'shortDescription' : '!null',
    sortField: 'rating.imdb',
    sortType: '-1',
    page: 1
}