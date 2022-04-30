const express = require('express')
const app = express()

let countryData = null
const countryNames = []

const getCountryNames = () => {
  for (data of countryData) {
    countryNames.push(data.name.common)
  }
  console.log(countryNames)
}

fetch('https://restcountries.com/v3.1/all')
  .then((res) => res.json())
  .then((data) => {
    countryData = data
    getCountryNames()
  })

module.exports = app
