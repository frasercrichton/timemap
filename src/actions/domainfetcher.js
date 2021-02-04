import serverRequestConfiguration from './serverRequestConfiguration'
import { httpResourceHelper } from './httpResourceHelper'

// this needs to deal with missing features so validate against the supported features
// const supportedFeatures = ['USE_EVENTS', 'USE_ASSOCIATIONS', 'USE_SOURCES', 'USE_SITES', 'USE_SHAPES']

const requestErrorMessage = (url, domain, error) => `The '${domain}' returned ${error.message}`

const fetchDomain = (features) => {
  const { USE_ASSOCIATIONS, USE_SOURCES, USE_SITES, USE_SHAPES } = features

  const activeFeatures = ['USE_EVENTS', 'USE_SOURCES', 'USE_ASSOCIATIONS', 'USE_SITES', 'USE_SHAPES']

  // test this
  // const { configuration, errors } = serverRequestConfiguration('NO_ARRAY')
  const { configuration, errors } = serverRequestConfiguration(activeFeatures)
  const { SOURCES_URL, ASSOCIATIONS_URL, SHAPES_URL, SITES_URL } = configuration

  const notifications = [...errors]
  // if there are errors don't go any further
  const handleError = (message) => {
    notifications.push({
      message,
      type: 'error'
    })
  }

  const fetchDomainHttpResource = (url, domain) => httpResourceHelper(url, (error) => handleError(requestErrorMessage(url, domain, error)), [])

  return () => {
    // dispatch(toggleFetchingDomain())

    const EVENT_DATA_URL = ['http://localhost:4040/api/curfew/export_events/deeprows']

    // NB: EVENT_DATA_URL is a list, and so results are aggregated
    const eventsPromise = Promise.all(
      EVENT_DATA_URL.map((url) =>
        fetchDomainHttpResource(url, 'EVENTS_URL')
      )
    ).then((results) => results.flatMap((event) => event))

    let associationsPromise = Promise.resolve([])
    if (USE_ASSOCIATIONS) {
      if (ASSOCIATIONS_URL) {
        associationsPromise = fetchDomainHttpResource(ASSOCIATIONS_URL, 'ASSOCIATIONS_URL')
      }
    }

    let sourcesPromise = Promise.resolve([])
    if (USE_SOURCES) {
      if (SOURCES_URL) {
        sourcesPromise = fetchDomainHttpResource(SOURCES_URL, 'SOURCES_URL')
      }
    }

    let sitesPromise = Promise.resolve([])
    if (USE_SITES) {
      if (SITES_URL) {
        sitesPromise = fetchDomainHttpResource(SITES_URL, 'SITES_URL')
      }
    }

    let shapesPromise = Promise.resolve([])
    if (USE_SHAPES) {
      if (SHAPES_URL) {
        shapesPromise = fetchDomainHttpResource(SHAPES_URL, 'SHAPES_URL')
      }
    }

    return Promise.all([
      eventsPromise,
      associationsPromise,
      sourcesPromise,
      sitesPromise,
      shapesPromise
    ])
      .then((response) => {
        // no magic numbers
        const result = {
          events: response[0],
          associations: response[1],
          sources: response[2],
          sites: response[3],
          shapes: response[4],
          notifications
        }
        // eslint-disable-next-line no-prototype-builtins

        // console.log(notifications)
        // const hasErrors = Object.values(result).some((resp) => {
        //  // console.log(notifications)
        //   // console.log(resp)
        //   resp.hasOwnProperty('error')
        // })

        // if (notifications.length > 0) {
        //   throw new Error(
        //     'Some URLs returned negative. If you are in development, check the server is running'
        //   )
        // }
        // dispatch(toggleFetchingDomain())
        // dispatch(setInitialCategories(result.associations))
        return result
      })
      .catch((err) => {
        console.log('error', err.message)

        // dispatch(fetchError(err.message))
        // dispatch(toggleFetchingDomain())
        // TODO: handle this appropriately in React hierarchy
        // alert(err.message)
      })
  }
}

export default fetchDomain
