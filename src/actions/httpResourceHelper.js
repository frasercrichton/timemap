// eslint-disable-next-line no-undef
const httpResourceHelper = (url, errorHandler, defaultPayload) => fetch(url)
  .then(response => {
    if (!response.ok) {
      const httpErrorMessage = `Status: ${response.statusText}, Status code: ${response.status} for URL: ${url} - this could be an incorrect url.`
      return response.json().then(data => {
        errorHandler(new Error(`Error Message: ${data.error} ${httpErrorMessage}`))
        return data
      })
    }
    return response.json()
  })
  .then(data => data)
  .catch(error => {
    const serverErrorMessage = `Status: server error ${error.message}, for URL: ${url} - is the server running?`
    errorHandler(new Error(serverErrorMessage))
    return defaultPayload
  })

exports.httpResourceHelper = httpResourceHelper
