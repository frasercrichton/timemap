import fetchMock from 'fetch-mock-jest'

import fetchDomain from './domainfetcher'

import IncidentBuilderParsed from '../_testHelpers/IncidentBuilderParsed'

const incidents = [
  new IncidentBuilderParsed().build(),
  new IncidentBuilderParsed()
    .withDateTime('2000-05-10T13:00:00.000Z').build()]

const sources = [{
  paths: [
    'https://storage.googleapis.com/rake-community/reporter-detained-zip-tied-and-searched-while-covering-san-francisco-protest.md',
    'https://pressfreedomtracker.us/media/images/RTS39V4M.2e16d0ba.fill-1330x880.jpg'
  ],
  id: 'source1Id',
  title: 'How curfews have historically been used to restrict the physical and political movements of black people in the U.S.',
  description: 'How curfews have historically been used to restrict the physical and political movements of black people in the U.S.',
  thumbnail: 'https://pressfreedomtracker.us/media/images/RTS39V4M.2e16d0ba.fill-1330x880.jpg',
  url: 'https://pressfreedomtracker.us/all-incidents/reporter-detained-zip-tied-and-searched-while-covering-san-francisco-protest/',
  type: ''
}, {
  paths: [
    'https://storage.googleapis.com/rake-community/reporter-detained-zip-tied-and-searched-while-covering-san-francisco-protest.md',
    'https://pressfreedomtracker.us/media/images/RTS39V4M.2e16d0ba.fill-1330x880.jpg'
  ],
  id: 'source2Id',
  title: 'How curfews have historically been used to restrict the physical and political movements of black people in the U.S.',
  description: 'How curfews have historically been used to restrict the physical and political movements of black people in the U.S.',
  thumbnail: 'RTS39V4M.2e16d0ba.fill-1330x880.png',
  url: 'https://pressfreedomtracker.us/all-incidents/reporter-detained-zip-tied-and-searched-while-covering-san-francisco-protest/',
  type: 'Photo'
}]
const sites = [{ site: 'one' }]
const shapes = [{ shape: 'one' }]

const EVENT_DATA_URL = ['http://localhost:4040/api/curfew/export_events/deeprows']
const SOURCES_URL = 'http://localhost:4040/api/curfew/export_sources/deeprows'
const ASSOCIATIONS_URL = 'http://localhost:4040/api/curfew/export_associations/deeprows'
const SITES_URL = 'http://localhost:4040/api/curfew/export_sites/deeprows'
const SHAPES_URL = 'http://localhost:4040/api/curfew/export_shapes/deeprows'

const configurationError = (domain) => `USE_${domain} is true, but ${domain}_EXT was not found - are you sure you have defined it? e.g. EVENTS_EXT: '/api/your-server/export_events/deeprows'.`

const features = { USE_ASSOCIATIONS: true, USE_SOURCES: true, USE_SITES: true, USE_SHAPES: true }

const errorMessage = (domain, error) => `The '${domain}' HTTP request returned ${error}`

const OLD_ENV = process.env

const httpError = (url) => `Error: Not Found, HTTP status: 404 for URL: ${url} - this could be an incorrect url.`

const httpServerError = (url) => `Error: Server error Not found, for URL: ${url} - is the server running at that url address?`

describe('Fetch Domain: call dataserver for domain', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    // should really mock this so we are only process.env in one place
    process.env.SERVER_ROOT = 'http://localhost:4040'
    process.env.EVENTS_EXT = ['/api/curfew/export_events/deeprows']
    process.env.ASSOCIATIONS_EXT = '/api/curfew/export_associations/deeprows'
    process.env.SOURCES_EXT = '/api/curfew/export_sources/deeprows'
    process.env.SITES_EXT = '/api/curfew/export_sites/deeprows'
    process.env.SHAPES_EXT = '/api/curfew/export_shapes/deeprows'

    // jest.mock('./urlFromEnv', () => ({
    //   getUrlFromProcessEnv: jest.fn().mockImplementation(() => [process.env.SERVER_ROOT = 'http://localhost:4040'])
    // }))

    // const getUrlFromProcessEnvMock = jest.spyOn(getUrlFromProcessEnv, 'getUrlFromProcessEnv')
    // const mockDispatch = jest.fn().mockImplementation(() => {})
    // getUrlFromProcessEnv.mockClear()
    // getUrlFromProcessEnv.mockReturnValue(['my url'])

    fetchMock.reset()
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  it('Should return a successful populated domain', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should return a successful populated domain', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })
    // process.env.ASSOCIATIONS_EXT = ''
    // process.env.SHAPES_EXT = ''
    return fetchDomain(features)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should return an error for a missing sources url', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    delete process.env.SOURCES_EXT

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message).toEqual(configurationError('SOURCES'))
      expect(domain.sources).toStrictEqual([])
    })
  })

  it('Should return an error for a missing sites url', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    delete process.env.SITES_EXT

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message).toEqual(configurationError('SITES'))
      expect(domain.sites).toStrictEqual([])
    })
  })

  it('Should return an error for a missing shapes url', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    delete process.env.SHAPES_EXT

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message).toEqual(configurationError('SHAPES'))
      expect(domain.shapes).toStrictEqual([])
    })
  })

  it('Should return an error for a missing associations url', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })
    delete process.env.ASSOCIATIONS_EXT

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message).toEqual(configurationError('ASSOCIATIONS'))
      expect(domain.associations).toStrictEqual([])
    })
  })

  it('Should not return the associations feature', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    const missingFeatures = { USE_ASSOCIATIONS: false, USE_SOURCES: true, USE_SITES: true, USE_SHAPES: true }

    return fetchDomain(missingFeatures)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.associations).toStrictEqual([])
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should not return the sources feature', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    const missingFeatures = { USE_ASSOCIATIONS: true, USE_SOURCES: false, USE_SITES: true, USE_SHAPES: true }

    return fetchDomain(missingFeatures)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual([])
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should not return the sites feature', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    const missingFeatures = { USE_ASSOCIATIONS: true, USE_SOURCES: true, USE_SITES: false, USE_SHAPES: true }

    return fetchDomain(missingFeatures)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.sites).toStrictEqual([])
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should not return the shapes feature', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    const missingFeatures = { USE_ASSOCIATIONS: true, USE_SOURCES: true, USE_SITES: true, USE_SHAPES: false }

    return fetchDomain(missingFeatures)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual([])
    })
  })

  it('Should report error for events', () => {
    fetchMock.once(EVENT_DATA_URL, { throws: Error('Not found') }, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('EVENTS_URL', httpServerError('http://localhost:4040/api/curfew/export_events/deeprows')))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.events).toStrictEqual([])
    })
  })

  it('Should report error for sources', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, { throws: Error('Not found') }, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('SOURCES_URL', httpServerError('http://localhost:4040/api/curfew/export_sources/deeprows')))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.sources).toStrictEqual([])
    })
  })

  it('Should report error for associations', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { throws: Error('Not found') }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('ASSOCIATIONS_URL', httpServerError('http://localhost:4040/api/curfew/export_associations/deeprows')))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.associations).toStrictEqual([])
    })
  })
  it('Should report error for sites', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, { throws: Error('Not found') }, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('SITES_URL', httpServerError('http://localhost:4040/api/curfew/export_sites/deeprows')))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.sites).toStrictEqual([])
    })
  })

  it('Should report error for shapes', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, { throws: Error('Not found') }, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('SHAPES_URL', httpServerError('http://localhost:4040/api/curfew/export_shapes/deeprows')))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.shapes).toStrictEqual([])
    })
  })

  it('Should report 404 error for events', () => {
    fetchMock.once(EVENT_DATA_URL, { body: '{}', status: 404 }, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('EVENTS_URL', httpError('http://localhost:4040/api/curfew/export_events/deeprows')))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.events).toStrictEqual([])
    })
  })

  it('Should report 404 error for sources', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, { body: '{}', status: 404 }, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage(
          'SOURCES_URL',
          httpError('http://localhost:4040/api/curfew/export_sources/deeprows')))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.sources).toStrictEqual([])
    })
  })

  it('Should report 404 error for associations', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { body: '{}', status: 404 }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('ASSOCIATIONS_URL', httpError('http://localhost:4040/api/curfew/export_associations/deeprows')))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.associations).toStrictEqual([])
    })
  })

  it('Should report 404 error for sites', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, { body: '{}', status: 404 }, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('SITES_URL', httpError('http://localhost:4040/api/curfew/export_sites/deeprows')))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.sites).toStrictEqual([])
    })
  })

  it('Should report 404 error for shapes', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, { body: '{}', status: 404 }, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('SHAPES_URL', httpError('http://localhost:4040/api/curfew/export_shapes/deeprows')))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.shapes).toStrictEqual([])
    })
  })
  //  it('Should report 404 error for multiple errors', () => {

  //  it('Should work with multiple event arrays', () => {

  // urlFromEnv
})
