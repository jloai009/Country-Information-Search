const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const Trie = require('./utils/Trie')

const countryNamesTrie = new Trie()
const countryMap = new Map()

//const countryNames = []

const buildMapAndTrie = (countryData) => {
  for (data of countryData) {
    const countryName = data.name.common.toLowerCase()
    countryMap.set(countryName, data)
    //countryNames.push(name)
    countryNamesTrie.insert(countryName)
  }
  //console.log(countryNamesTrie.find('col'))
  //console.log(countryMap.get('colombia'))
}

fetch('https://restcountries.com/v3.1/all')
  .then((res) => res.json())
  .then((countryData) => {
    buildMapAndTrie(countryData)
  })

app.use(cors())
app.use(express.json())

app.get('/api/countries/:id', async (request, response, next) => {
  const id = request.params.id
  console.log(id, 'hello world')
  response.json({ helloWorld: 'helloWorld' })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
