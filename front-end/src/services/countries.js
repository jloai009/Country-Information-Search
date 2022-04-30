import axios from 'axios'

const searchCountry = async (country) => {
  const response = await axios.get('/api/search/' + country)
  return response.data.countries
}

const getCountry = async (country) => {
  const response = await axios.get('/api/get/' + country)
  return response.data.country
}

const countryServices = {
  searchCountry,
  getCountry,
}

export default countryServices
