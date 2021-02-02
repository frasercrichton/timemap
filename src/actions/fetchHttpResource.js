const statusErrorFragment = 'HTTP status'
// eslint-disable-next-line no-undef
const fetchHttpResource = (url, errorHandler) => fetch(url)
  .then(response => {
    if (!response.ok) {
      throw Error(`${response.statusText}, ${statusErrorFragment}: ${response.status} for URL: ${url} - this could be an incorrect url.`)
    } else {
      return response.json()
    }
  })
  .then(data => data)
  .catch(error => {
    if (error.message.includes(statusErrorFragment)) {
      return errorHandler(error)
    }
    const newError = new Error(`Server error ${error.message}, for URL: ${url} - is the server running at that url address?`)
    return errorHandler(newError)
  })

exports.fetchHttpResource = fetchHttpResource
