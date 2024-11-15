import { useState, useEffect } from 'react'
import Service from './services/countries.js'

const App = () => {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('')
  const [message, setMessage] = useState('')

  const hook = () => {
    
    if (country) {
      Service
          .getAll()
          .then(allCountries => {
            const filter = allCountries.filter( _ => _.name.common.toLowerCase().includes(country.toLowerCase()))
            if (filter.length > 10){
              setCountries([])
              setMessage('Too many matches, specify another filter')
            } else if (filter.length === 1) {
              Service.getWeather(filter[0].capital).then(weather => setMessage(<CountryCard land={filter[0]} weather={weather.list[0]} />))
              setCountries([])
            } else {
              setCountries(filter)
              setMessage('')
            }
          })
    } else {
      setCountries([])
      setMessage('Start typing...')
    }
  }

  useEffect(hook, [country])

  const CountryCard = ({ land, weather }) => {
    const langs = Object.values(land.languages)
    const flagUrl = land.flags.png
    const weatherId = weather.weather[0].icon
    const weatherIcon = `https://openweathermap.org/img/wn/${weatherId}@2x.png`
    return (
      <div>
        <h1>{land.name.common}</h1>
        <p>capital {land.capital}</p>
        <p>area {land.area}</p>
        <strong>languages:</strong>
        {langs.map( _ => <ul key={_}><li>{ _ }</li></ul>)}
        <img src={flagUrl}></img>
        <h1>Weather in {land.capital}</h1>
        <p>temperature {weather.main.temp} Celcius</p>
        <img src={weatherIcon}></img>
        <p>wind {weather.wind.speed} m/s</p>
      </div>
    )

  }

  const handleChange = (event) => {
    setCountry(event.target.value)
  }

  return (

    <div>
      <p>find countries <input value={country} onChange={handleChange}></input></p>
      {countries.map( _ => <p key={ _.name.official }>{_.name.common}<button onClick={() => 
        Service.getWeather( _.capital).then(weather => setMessage(<CountryCard land={ _ } weather={weather.list[0]} />))}>show</button></p> )}
      {message}
    </div>

  )

}

export default App
