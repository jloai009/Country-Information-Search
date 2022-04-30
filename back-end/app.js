const express = require('express')
const app = express()
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

module.exports = app
