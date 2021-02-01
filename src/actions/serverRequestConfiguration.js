import { serverRequestVarsLookup } from './serverRequestVarsLookup'

// validate urls

// const configErrorMessage = (domain) => `USE_${domain} is true, but you have not provided a ${domain}_EXT`

// remove  anything that has an error

// return lisy of errors
// thsi naming is really messy: USE_EVENTS, EVENTS_EXT, EVENT_DATA_URL, SOURCES_URL

// if a domain exists but hasn't been provided in features this all falls off a cliff

/*
 If something generates an error then that feature does not get passed back
*/
const serverRequestConfiguration = (features) => {
  const prefix = 'USE_'
  const environmentVariableSuffix = '_EXT'
  const configuration = {}
  const errors = []

  // TODO externalise
  const handleError = (message) => {
    errors.push({
      message,
      type: 'error'
    })
  }

  if (!features || !Array.isArray(features) || features.length === 0) {
    handleError('No features to return configuration for.')
    return { configuration, errors }
  }

  features.forEach((item) => {
    try {
      // TODO this is fragile!
      const lookup = item.split(prefix).pop()
      // handle arrays []
      // rename configlookup
      // const configItem = { [item]: { url: getUrlFromProcessEnv(`${lookup}${environmentVariableSuffix}`) } }
      configuration[`${lookup}_URL`] = serverRequestVarsLookup(`${lookup}${environmentVariableSuffix}`)
      return configuration
    } catch (error) {
      // if its a server error stop
      handleError(`${item} is true, but ${error.message}`)
      return []
    }
  })

  // warning no feature specified list

  return { configuration, errors }
}

export default serverRequestConfiguration
