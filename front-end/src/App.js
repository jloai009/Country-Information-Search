import React, { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import axios from 'axios'
import countryServices from './services/countries'

const SearchForm = ({ searchResults, setSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInProgress, setSearchInProgress] = useState(false)

  const handleSearch = async (event) => {
    let newSearchQuery = event.target.value.trimStart()
    newSearchQuery = newSearchQuery.replace(/\s+/g, " ");
    setSearchInProgress(true)
    setSearchQuery(newSearchQuery)
    let searchResults = []
    if (newSearchQuery.length > 0) {
      searchResults = await countryServices.searchCountry(newSearchQuery)
    }
    if (!searchResults) {
      searchResults = []
    }
    setSearchResults(searchResults)
    setSearchInProgress(false)
  }

  const selectCountry = async (countryName) => {
    const country = await countryServices.getCountry(countryName)
    setSearchQuery(countryName)
    setSearchResults(country)
  }

  const Suggestions = () => {
    if (
      searchQuery.length > 0 &&
      searchResults.length == 0 &&
      !searchInProgress
    ) {
      return (
        <div id="suggestions">
          <span id="no-found">No countries were found</span>
        </div>
      )
    } else if (searchQuery.length !== 0 && searchResults.length > 1) {
      return (
        <div id="suggestions">
          <ul>
            {searchResults.slice(0, 9).map((countryName) => (
              <li onClick={() => selectCountry(countryName)} key={countryName}>
                <pre> {countryName}</pre>
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
      <h2 id="search-bar-label">Search for a country:</h2>
      <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        <div id="search-bar">
          <input
            placeholder={'Name of country'}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
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
    <React.Fragment>
      <h2>Search Results: </h2>
      <div className="country-info">
        <h3 className="country-title">
          {country.name.official} - {country.cca2}
        </h3>
        <div>
          <strong>Flag: </strong>
          <img src={country.flags.png} alt={'Flag of ' + country.name.common} />
          <strong>Coat of Arms: </strong>
          <img
            src={country.coatOfArms.png}
            alt={'Coat of arms of ' + country.name.common}
          />
        </div>
        <div>
          <strong>Capital: </strong>
          {country.capital}
        </div>
        <div>
          <strong>Population: </strong>
          {country.population.toLocaleString()}
        </div>
        <div>
          <strong>Independent: </strong>
          {country.independent ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Member of the United Nations: </strong>
          {country.unMember ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Languages:</strong>
          <ul>
            {Object.values(country.languages).map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </div>
        <div className="currencies">
          <strong>Currencies: </strong>
          <ul>
            {Object.values(country.currencies).map((curr) => (
              <li key={curr.name}>{curr.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Region: </strong>
          {country.region}
        </div>
        <div>
          <strong>Subregion: </strong>
          {country.subregion}
        </div>
        <div>
          <strong>Google Maps: </strong>
          <a
            href={country.maps.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
          >
            {country.maps.googleMaps}
          </a>
        </div>
        <div>
          <strong>Continents: </strong>
          <ul>
            {country.continents.map((cont) => (
              <li key={cont}>{cont}</li>
            ))}
          </ul>
        </div>
        <div className="start-of-week">
          <strong>Start of Week: </strong>
          {country.startOfWeek}
        </div>
        <div>
          <strong>Timezones: </strong>
          <ul>
            {country.timezones.map((tm) => (
              <li key={tm}>{tm}</li>
            ))}
          </ul>
        </div>
      </div>
    </React.Fragment>
  )
}

const App = () => {
  const [searchResults, setSearchResults] = useState([])
  return (
    <div id="App">
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
