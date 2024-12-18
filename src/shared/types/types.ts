import { Filter, MovieFields } from "@openmoviedb/kinopoiskdev_client";

export type CardImageAndDescription = {
    id?: number,
    photo?: string,
    description1?: string,
    description2?: string,
    onClick?: () => void
}

export type Params = {
    id: string | undefined;
}

export type movieInfo = {
    id: number,
    name: string,
    rating: number,
    year: number,
    SRC: string
}

export type Results = {
    id: number,
    poster: string,
    name: string,
    shortDescription: string | undefined,
    rating: number | undefined,
    year: number | undefined,
}

export type FetchParams = {
    query: Filter<MovieFields>;
    limitForQuery: number;
}

export type Options = {
    value?: string,
    label?: string
}
export type OptionsLS = {
    name?: string,
    slug?: string
}
export type Years = {
    value?: number,
    label?: number
}
export type PersonInMovies = {
    alternativeName?: string;
    description?: string;
    enProfession?: string;
    id?: number;
    name?: string;
    rating?: number;
}
