import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const weatherUrl = (name) => `https://api.openweathermap.org/data/2.5/find?q=${name}&appid=${api_key}&units=metric`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeather = (name) => {
    const request = axios.get(weatherUrl(name))
    return request.then(response => response.data)
}

export default { getAll, getWeather }