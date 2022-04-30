import React, { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import axios from 'axios'

const H1 = ({ text }) => <h1>{text}</h1>

const H2 = ({ text }) => <h2>{text}</h2>

const H3 = ({ text }) => <h3>{text}</h3>

const SearchForm = ({ searchStr, handleSearch }) => {
  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="search-bar">Search for a country:&ensp;</label>
        <input
          id="search-bar"
          placeholder={'Name of country'}
          value={searchStr}
          onChange={handleSearch}
        />
      </form>
    </div>
  )
}

const ResultsDisplay = ({
  searchResultsDisplayed,
  setSearchQuery,
  setSearchResultsDisplayed,
  searchResults,
}) => {
  if (
    searchResultsDisplayed.length === 1 &&
    searchResultsDisplayed[0].name.common !== 'Fetching Search Results...'
  ) {
    return <DisplayCountry country={searchResultsDisplayed[0]} />
  }

  const showCountryHandler = (countryName) => {
    setSearchQuery(countryName)
    setSearchResultsDisplayed(
      searchResults.filter((country) =>
        country.name.common.toLowerCase().includes(countryName.toLowerCase())
      )
    )
  }

  return (
    <div>
      {searchResultsDisplayed.length ? (
        searchResultsDisplayed.map((country) => (
          <p key={country.name.common}>
            {country.name.common}
            <button onClick={() => showCountryHandler(country.name.common)}>
              show
            </button>
          </p>
        ))
      ) : (
        <p>No countries were found</p>
      )}
    </div>
  )
}

const DisplayCountry = ({ country }) => {
  return (
    <div>
      <H3 text={country.name.common} />
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
  console.log(process.env.REACT_APP_API_KEY)
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
    console.log(weatherData)
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
  const [searchStr, setSearchQuery] = useState('')

  const [searchResults, setSearchResults] = useState([
    { name: { common: 'Fetching Search Results...' } },
  ])

  const [searchResultsDisplayed, setSearchResultsDisplayed] = useState([
    { name: { common: 'Fetching Search Results...' } },
  ])

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then((promise) => {
      setSearchResults(promise.data)
      setSearchResultsDisplayed(promise.data)
    })
  }, [])

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
    setSearchResultsDisplayed(
      searchResults.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    )
  }

  return (
    <div>
      <h1> Country Information Search</h1>
      <SearchForm searchStr={searchStr} handleSearch={handleSearch} />
      <H2 text="Search Results:" />
      <ResultsDisplay
        searchResultsDisplayed={searchResultsDisplayed}
        setSearchQuery={setSearchQuery}
        setSearchResultsDisplayed={setSearchResultsDisplayed}
        searchResults={searchResults}
      />
    </div>
  )
}

export default App
