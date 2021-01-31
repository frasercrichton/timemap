
// eslint-disable-next-line no-undef
const fetchResource = (url, errorHandler) => fetch(url)
  .then(response => {
    if (!response.ok) {
      throw Error(`[Http status: ${response.status} error: ${response.statusText}]`)
    } else {
      return response.json()
    }
  })
  .then(data => data)
  .catch(error => errorHandler(error))

exports.fetchResource = fetchResource
