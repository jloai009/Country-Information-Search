const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const Trie = require('./utils/Trie')

const countryNamesTrie = new Trie()
const countryMap = new Map()

const buildMapAndTrie = (countryData) => {
  for (data of countryData) {
    const countryName = data.name.common.toLowerCase()
    countryMap.set(countryName, data)
    countryNamesTrie.insert(countryName)
  }
}

fetch('https://restcountries.com/v3.1/all')
  .then((res) => res.json())
  .then((countryData) => {
    buildMapAndTrie(countryData)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.get('/api/search/:id', async (request, response, next) => {
  const id = request.params.id.toLocaleLowerCase()
  const matches = countryNamesTrie.find(id)
  response.json({
    countries: matches.length === 1 ? [countryMap.get(matches[0])] : matches,
  })
})

app.get('/api/get/:id', async (request, response, next) => {
  const id = request.params.id.toLocaleLowerCase()
  console.log(countryMap.get(id))
  response.json({
    country: [countryMap.get(id)],
  })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
