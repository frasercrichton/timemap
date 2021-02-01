const handleError = (message) => {
  const x = {
    message,
    type: 'error'
  }
  return Promise.resolve([])
}

// TODO report URL for general error
// eslint-disable-next-line no-undef
const fetchResource = (url, errorHandler) => fetch(url)
  .then(response => {
    if (!response.ok) {
      throw Error(`${response.statusText}, HTTP status: ${response.status} for URL: ${url}`)
    } else {
      return response.json()
    }
  })
  .then(data => data)
  .catch(errorHandler)

exports.fetchResource = fetchResource
