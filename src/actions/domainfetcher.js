import serverRequestConfiguration from './serverRequestConfiguration'

// TODO: relegate these URLs entirely to environment variables
// const EVENT_DATA_URL = getUrlFromProcessEnv('EVENTS_EXT')
// const ASSOCIATIONS_URL = urlFromEnv('ASSOCIATIONS_EXT')
// const SOURCES_URL = urlFromEnv('SOURCES_EXT')
// const SITES_URL = urlFromEnv('SITES_EXT')
// const SHAPES_URL = urlFromEnv('SHAPES_EXT')

// const EVENT_DATA_URL = ['http://localhost:4040/api/curfew/export_events/deeprows']
// const SOURCES_URL = 'http://localhost:4040/api/curfew/export_sources/deeprows'
// const ASSOCIATIONS_URL = 'http://localhost:4040/api/curfew/export_associations/deeprows'
// const SITES_URL = 'http://localhost:4040/api/curfew/export_sites/deeprows'
// const SHAPES_URL = 'http://localhost:4040/api/curfew/export_shapes/deeprows'
const configErrorMessage = (domain) => `USE_${domain} is true, but you have not provided a ${domain}_EXT`

const fetchDomain = (features, urls) => {
  // [featuretoggle : url || [] ]
  const { USE_EVENTS, USE_ASSOCIATIONS, USE_SOURCES, USE_SITES, USE_SHAPES } = features

  const config = serverRequestConfiguration(features)

  const { EVENT_DATA_URL, SOURCES_URL, ASSOCIATIONS_URL, SITES_URL, SHAPES_URL } = urls

  // const features = getState().features;
  //     dispatch(toggleFetchingDomain());

  const notifications = []

  const requestErrorMessage = (url, domain, error) => `The url: ${url} for: '${domain}' returned a server error: ${error} this could be an incorrect url configuration or a server issue.`

  const handleError = (message) => {
    notifications.push({
      message,
      type: 'error'
    })
    return Promise.resolve([])
  }

  // eslint-disable-next-line no-undef
  const fetchUrl = (url, domain) => fetch(url)
    .then(response => {
      if (!response.ok) {
        throw Error(`[Http status: ${response.status} error: ${response.statusText}]`)
      } else {
        return response.json()
      }
    })
    .then(data => data)
    .catch(error => handleError(requestErrorMessage(url, domain, error)))

  // dispatch, getState
  return () => {
    // dispatch(toggleFetchingDomain())
    // thsi nees to deal with missing features

    const supportedFeatures = ['USE_EVENTS', 'USE_ASSOCIATIONS', 'USE_SOURCES', 'USE_SITES', 'USE_SHAPES']

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
      if (!ASSOCIATIONS_URL) {
        associationsPromise =
          handleError(configErrorMessage('ASSOCIATIONS'))
      } else {
        associationsPromise = fetchUrl(ASSOCIATIONS_URL, 'associations')
      }
    }

    let sourcesPromise = Promise.resolve([])
    if (USE_SOURCES) {
      if (!SOURCES_URL) {
        sourcesPromise = handleError(configErrorMessage('SOURCES'))
      } else {
        sourcesPromise = fetchUrl(SOURCES_URL, 'sources')
      }
    }

    let sitesPromise = Promise.resolve([])
    if (USE_SITES) {
      if (!SITES_URL) {
        sitesPromise = handleError(configErrorMessage('SITES'))
      } else {
        sitesPromise = fetchUrl(SITES_URL, 'sites')
      }
    }

    let shapesPromise = Promise.resolve([])
    if (USE_SHAPES) {
      if (!SHAPES_URL) {
        shapesPromise = handleError(configErrorMessage('SHAPES'))
      } else {
        shapesPromise = fetchUrl(SHAPES_URL, 'shapes')
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