import serverRequestConfiguration from './serverRequestConfiguration'

const OLD_ENV = process.env

const supportedFeatures = ['USE_EVENTS', 'USE_ASSOCIATIONS', 'USE_SOURCES', 'USE_SITES', 'USE_SHAPES']

const errorMessage = 'EVENTS_EXT was not found - are you sure you have defined it? e.g. EVENTS_EXT: \'/api/your-server/export_events/deeprows\'.'
describe('urlFromEnv : URL from environment variables', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  const serverRootUrl = 'http://localhost:4040'

  const eventsUrl = '/api/events'
  const associationsUrl = '/api/associations'
  const sourcesUrl = '/api/sources'
  const sitesUrl = '/api/sites'
  const shapesUrl = '/api/shapes'

  const successResult = {
    ASSOCIATIONS_URL: `${serverRootUrl}${associationsUrl}`,
    EVENTS_URL: `${serverRootUrl}${eventsUrl}`,
    SHAPES_URL: `${serverRootUrl}${shapesUrl}`,
    SITES_URL: `${serverRootUrl}${sitesUrl}`,
    SOURCES_URL: `${serverRootUrl}${sourcesUrl}`
  }

  const successResultWithArray = {
    ASSOCIATIONS_URL: [`${serverRootUrl}${associationsUrl}`, `${serverRootUrl}${associationsUrl}`],
    EVENTS_URL: [`${serverRootUrl}${eventsUrl}`, `${serverRootUrl}${eventsUrl}`],
    SHAPES_URL: `${serverRootUrl}${shapesUrl}`,
    SITES_URL: `${serverRootUrl}${sitesUrl}`,
    SOURCES_URL: `${serverRootUrl}${sourcesUrl}`
  }

  it('Should successfully process configuration', () => {
    process.env.SERVER_ROOT = serverRootUrl
    process.env.EVENTS_EXT = eventsUrl
    process.env.ASSOCIATIONS_EXT = associationsUrl
    process.env.SOURCES_EXT = sourcesUrl
    process.env.SITES_EXT = sitesUrl
    process.env.SHAPES_EXT = shapesUrl

    const { configuration, errors } = serverRequestConfiguration(supportedFeatures)
    expect(errors.length).toEqual(0)
    expect(configuration).toEqual(successResult)
  })

  it('Should successfully process configuration with arrays', () => {
    process.env.SERVER_ROOT = serverRootUrl
    process.env.EVENTS_EXT = [eventsUrl, eventsUrl]
    process.env.ASSOCIATIONS_EXT = [associationsUrl, associationsUrl]
    process.env.SOURCES_EXT = sourcesUrl
    process.env.SITES_EXT = sitesUrl
    process.env.SHAPES_EXT = shapesUrl

    const { configuration, errors } = serverRequestConfiguration(supportedFeatures)
    expect(errors.length).toEqual(0)
    expect(configuration).toEqual(successResultWithArray)
  })

  it('Should report missing server address correctly', () => {
  //   process.env.SERVER_ROOT = serverRootUrl
    process.env.EVENTS_EXT = eventsUrl
    process.env.ASSOCIATIONS_EXT = associationsUrl
    process.env.SOURCES_EXT = sourcesUrl
    process.env.SITES_EXT = sitesUrl
    process.env.SHAPES_EXT = shapesUrl

    const { configuration, errors } = serverRequestConfiguration(supportedFeatures)
    // server root catastrophic error
    expect(errors.length).toEqual(5)
    expect(errors[0].message).toEqual('The Dataserver url is missing - have you configured it correctly? e.g. SERVER_ROOT: http://localhost:8080.')
  })

  it('Should report missing environment variable', () => {
    process.env.SERVER_ROOT = serverRootUrl
    process.env.ASSOCIATIONS_EXT = associationsUrl
    process.env.SOURCES_EXT = sourcesUrl
    process.env.SITES_EXT = sitesUrl
    process.env.SHAPES_EXT = shapesUrl

    const { configuration, errors } = serverRequestConfiguration(supportedFeatures)
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual(errorMessage)
    delete successResult.EVENTS_URL
    expect(configuration).toEqual(successResult)
  })

  it('Should report blank environment variable', () => {
    process.env.SERVER_ROOT = serverRootUrl
    process.env.ASSOCIATIONS_EXT = associationsUrl
    process.env.EVENTS_EXT = ''
    process.env.SOURCES_EXT = sourcesUrl
    process.env.SITES_EXT = sitesUrl
    process.env.SHAPES_EXT = shapesUrl

    const { configuration, errors } = serverRequestConfiguration(supportedFeatures)
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual(errorMessage)
    delete successResult.EVENTS_URL
    expect(configuration).toEqual(successResult)
  })

  it('Should work on the basis of if it is not passed it is not an error', () => {
    process.env.SERVER_ROOT = serverRootUrl
    process.env.ASSOCIATIONS_EXT = associationsUrl

    const { errors } = serverRequestConfiguration(['USE_ASSOCIATIONS'])
    expect(errors.length).toEqual(0)
  })
})
