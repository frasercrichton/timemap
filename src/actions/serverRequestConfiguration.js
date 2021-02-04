import { envVarsLookup } from './envVarsLookup'

// validate urls
// thsi naming is really messy: USE_EVENTS, EVENTS_EXT, EVENT_DATA_URL, SOURCES_URL

// if a domain exists but hasn't been provided in features this all falls off a cliff

/*
 If something generates an error then that feature does not get passed back
*/
const serverRequestConfiguration = (features) => {
  const prefix = 'USE_'
  const environmentVariableSuffix = '_EXT'
  const REACT_APP = 'REACT_APP_'
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
      configuration[`${lookup}_URL`] = envVarsLookup(`${REACT_APP}${lookup}${environmentVariableSuffix}`)
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
