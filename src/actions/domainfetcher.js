import serverRequestConfiguration from './serverRequestConfiguration'
import { fetchResource } from './fetchResource'

// TODO: relegate these URLs entirely to environment variables
// const EVENT_DATA_URL = getUrlFromProcessEnv('EVENTS_EXT')
// const ASSOCIATIONS_URL = serverRequestConfiguration('ASSOCIATIONS_EXT')
// const SOURCES_URL = urlFromEnv('SOURCES_EXT')
// const SITES_URL = urlFromEnv('SITES_EXT')
// const SHAPES_URL = urlFromEnv('SHAPES_EXT')

// const EVENT_DATA_URL = ['http://localhost:4040/api/curfew/export_events/deeprows']
// const SOURCES_URL = 'http://localhost:4040/api/curfew/export_sources/deeprows'
// const SITES_URL = 'http://localhost:4040/api/curfew/export_sites/deeprows'
// const SHAPES_URL = 'http://localhost:4040/api/curfew/export_shapes/deeprows'

const configErrorMessage = (domain) => `USE_${domain} is true, but you have not provided a ${domain}_EXT`
// this needs to deal with missing features so validate against the supported features
const supportedFeatures = ['USE_EVENTS', 'USE_ASSOCIATIONS', 'USE_SOURCES', 'USE_SITES', 'USE_SHAPES']

const fetchDomain = (features, urls) => {
  // [featuretoggle : url || [] ]
  const { USE_EVENTS, USE_ASSOCIATIONS, USE_SOURCES, USE_SITES, USE_SHAPES } = features
  // const { EVENT_DATA_URL, SOURCES_URL, SITES_URL } = urls

  // const features = getState().features;
  //     dispatch(toggleFetchingDomain());

  // const activeFeatures = ['USE_EVENTS', 'USE_ASSOCIATIONS',  , 'USE_SHAPES']
  const activeFeatures = ['USE_SOURCES', 'USE_ASSOCIATIONS', 'USE_SITES', 'USE_SHAPES']

  // test this
  // const { configuration, errors } = serverRequestConfiguration('NO_ARRAY')
  const { configuration, errors } = serverRequestConfiguration(activeFeatures)
  const { EVENT_DATA_URL } = urls
  const { SOURCES_URL, ASSOCIATIONS_URL, SHAPES_URL, SITES_URL } = configuration

  const notifications = [...errors]
  // if (errors.length >= 1) {
  //   console.log(notifications)
  // }
  const handleError = (message) => {
    notifications.push({
      message,
      type: 'error'
    })
    return Promise.resolve([])
  }
  if (notifications.length > 0) {
    console.log(notifications)
  }

  const requestErrorMessage = (url, domain, error) => `The '${domain}' HTTP request returned ${error} this could be an incorrect url or a server issue.`

  const fetchUrl = (url, domain) => fetchResource(url, (error) => handleError(requestErrorMessage(url, domain, error)))

  // dispatch, getState
  return () => {
    // dispatch(toggleFetchingDomain())

    // NB: EVENT_DATA_URL is a list, and so results are aggregated
    const eventPromise = Promise.all(
      // error check for url
      EVENT_DATA_URL.map((url) =>
      //   configErrorMessage('EVENTS')
        fetchUrl(url, 'events')
      )
    ).then((results) => results.flatMap((t) => t))

    let associationsPromise = Promise.resolve([])
    if (USE_ASSOCIATIONS) {
      if (ASSOCIATIONS_URL) {
        associationsPromise = fetchUrl(ASSOCIATIONS_URL, 'ASSOCIATIONS_URL')
      }
    }

    let sourcesPromise = Promise.resolve([])
    if (USE_SOURCES) {
      if (SOURCES_URL) {
        sourcesPromise = fetchUrl(SOURCES_URL, 'SOURCES_URL')
      }
    }

    let sitesPromise = Promise.resolve([])
    if (USE_SITES) {
      if (SITES_URL) {
        sitesPromise = fetchUrl(SITES_URL, 'SITES_URL')
      }
    }

    let shapesPromise = Promise.resolve([])
    if (USE_SHAPES) {
      if (SHAPES_URL) {
        shapesPromise = fetchUrl(SHAPES_URL, 'SHAPES_URL')
      }
    }

    return Promise.all([
      eventPromise,
      associationsPromise,
      sourcesPromise,
      sitesPromise,
      shapesPromise
    ])
      .then((response) => {
        const result = {
          events: response[0],
          associations: response[1],
          sources: response[2],
          sites: response[3],
          shapes: response[4],
          notifications
        }
        if (
          // eslint-disable-next-line no-prototype-builtins
          Object.values(result).some((resp) => resp.hasOwnProperty('error'))
        ) {
          throw new Error(
            'Some URLs returned negative. If you are in development, check the server is running'
          )
        }
        // dispatch(toggleFetchingDomain())
        // dispatch(setInitialCategories(result.associations))
        return result
      })
      .catch((err) => {
        console.log('error', err)

        // dispatch(fetchError(err.message))
        // dispatch(toggleFetchingDomain())
        // TODO: handle this appropriately in React hierarchy
        // alert(err.message)
      })
  }
}

export default fetchDomain
