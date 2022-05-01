const unknownEndpoint = (request, response) => {
  response.redirect('/')
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  response.status(500).send('Something broke!')
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}
