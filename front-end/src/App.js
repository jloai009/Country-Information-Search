import React, { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import axios from 'axios'
import countryServices from './services/countries'

const SearchForm = ({ searchResults, setSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (event) => {
    const newSearchQuery = event.target.value
    setSearchQuery(newSearchQuery)
    let searchResults = []
    if (newSearchQuery.length > 0) {
      searchResults = await countryServices.searchCountry(newSearchQuery)
    }
    setSearchResults(searchResults)
  }

  const selectCountry = async (countryName) => {
    const country = await countryServices.getCountry(countryName)
    setSearchQuery(countryName)
    setSearchResults(country)
  }

  const Suggestions = () => {
    if (searchQuery.length > 0 && searchResults.length == 0) {
      return <div> No countries were found </div>
    } else if (searchQuery.length !== 0 && searchResults.length > 1) {
      return (
        <div>
          <ul>
            {searchResults.slice(0, 9).map((countryName) => (
              <li onClick={() => selectCountry(countryName)} key={countryName}>
                {countryName}
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div>
      <h2>Search for a country:</h2>
      <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        <input
          id="search-bar"
          placeholder={'Name of country'}
          value={searchQuery}
          onChange={handleSearch}
        />
      </form>
      <Suggestions />
    </div>
  )
}

const DisplayCountry = ({ searchResults }) => {
  if (searchResults.length !== 1) {
    return null
  }

  const country = searchResults[0]
  return (
    <div>
      <h3>
        {country.name.official} - {country.cca2}
      </h3>
      <img src={country.flags.png} alt={'Flag of ' + country.name.common} />
      <p>
        <strong>Capital: </strong>
        {country.capital}
      </p>
      <p>
        <strong>Population: </strong>
        {country.population.toLocaleString()}
      </p>
      <h4>Languages:</h4>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={nanoid()}>{lang}</li>
        ))}
      </ul>
      <WeatherDisplay country={country} />
    </div>
  )
}

const WeatherDisplay = ({ country }) => {
  const [weatherData, setWeatherData] = useState([])
  const [fetchedData, setFechedData] = useState(false)
  //console.log(process.env.REACT_APP_API_KEY)
  const restAPI =
    'http://api.weatherstack.com/current?access_key=' +
    process.env.REACT_APP_API_KEY +
    `&query=${country.capital}`

  useEffect(() => {
    axios.get(restAPI).then((promise) => {
      setWeatherData(promise.data)
      setFechedData(true)
    })
  }, [restAPI])

  if (fetchedData) {
    //console.log(weatherData)
    return (
      <div>
        <h4>Weather in {country.capital}:</h4>
        <p>
          <strong>Temperature: </strong>
          {weatherData.current.temperature}
        </p>
        <img
          src={weatherData.current.weather_icons[0]}
          alt={'Image describing weather of ' + country.capital}
        />
        <p>
          <strong>Wind: </strong>
          {weatherData.current.wind_speed} mph, direction:{' '}
          {weatherData.current.wind_dir}
        </p>
      </div>
    )
  } else {
    return (
      <div>
        <h3>Weather in {country.capital}:</h3>
        <p>Loading weather data...</p>
      </div>
    )
  }
}

const App = () => {
  const [searchResults, setSearchResults] = useState([])
  return (
    <div>
      <h1>Country Information Search</h1>
      <SearchForm
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
      <DisplayCountry searchResults={searchResults} />
    </div>
  )
}

export default App
