import axios from 'axios'


const http = axios.create({
    baseURL: 'https://kinopoisk.dev/v1.4',
    headers: {
        Accept: 'application/json',
        'X-API-KEY': 'V6DZV6J-B3XM7PZ-QWQ6F3S-YJ3DWWZ',
      },
})

//общаемся джсонами
http.defaults.headers.common['Content-Type'] = 'application/json'


export default http

