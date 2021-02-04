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

const configurationErrorExpected = (domain) => `USE_${domain} is true, but REACT_APP_${domain}_EXT was not found - are you sure you have defined it? e.g. EVENTS_EXT: '/api/your-server/export_events/deeprows'.`

const features = { USE_ASSOCIATIONS: true, USE_SOURCES: true, USE_SITES: true, USE_SHAPES: true }

const OLD_ENV = process.env

const expectedHttpError = (domain, url) => `The '${domain}' returned Error Message: The resource 'deeprows' does not exist in the tab 'export_sources' in this sheet. Status: Not Found, Status code: 404 for URL: ${url} - this could be an incorrect url.`

const expectedServerError = (domain, url) => `The '${domain}' returned Status: server error Not found, for URL: ${url} - is the server running?`

const serverErrorBody = { error: "The resource 'deeprows' does not exist in the tab 'export_sources' in this sheet." }

describe('Fetch Domain: call dataserver for domain', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    // should really mock this so we are only process.env in one place
    process.env.REACT_APP_SERVER_ROOT = 'http://localhost:4040'
    process.env.REACT_APP_EVENTS_EXT = ['/api/curfew/export_events/deeprows']
    process.env.REACT_APP_ASSOCIATIONS_EXT = '/api/curfew/export_associations/deeprows'
    process.env.REACT_APP_SOURCES_EXT = '/api/curfew/export_sources/deeprows'
    process.env.REACT_APP_SITES_EXT = '/api/curfew/export_sites/deeprows'
    process.env.REACT_APP_SHAPES_EXT = '/api/curfew/export_shapes/deeprows'

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

    delete process.env.REACT_APP_SOURCES_EXT

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message).toEqual(configurationErrorExpected('SOURCES'))
      expect(domain.sources).toStrictEqual([])
    })
  })

  it('Should return an error for a missing sites url', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    delete process.env.REACT_APP_SITES_EXT

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message).toEqual(configurationErrorExpected('SITES'))
      expect(domain.sites).toStrictEqual([])
    })
  })

  it('Should return an error for a missing shapes url', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    delete process.env.REACT_APP_SHAPES_EXT

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message).toEqual(configurationErrorExpected('SHAPES'))
      expect(domain.shapes).toStrictEqual([])
    })
  })

  it('Should return an error for a missing associations url', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    delete process.env.REACT_APP_ASSOCIATIONS_EXT

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message).toEqual(configurationErrorExpected('ASSOCIATIONS'))
      expect(domain.associations).toStrictEqual([])
    })
  })

  it('Should not return a feature that has not been defined', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    const missingFeatures = { USE_ASSOCIATIONS: false, USE_SOURCES: true, USE_SITES: true, USE_SHAPES: true }

    return fetchDomain(missingFeatures)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.associations).toStrictEqual([])
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
        .toStrictEqual(expectedServerError('EVENTS_URL', 'http://localhost:4040/api/curfew/export_events/deeprows'))
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
        .toStrictEqual(expectedServerError('SOURCES_URL', 'http://localhost:4040/api/curfew/export_sources/deeprows'))
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
        .toStrictEqual(expectedServerError('ASSOCIATIONS_URL', 'http://localhost:4040/api/curfew/export_associations/deeprows'))
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
        .toStrictEqual(expectedServerError('SITES_URL', 'http://localhost:4040/api/curfew/export_sites/deeprows'))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.sites).toStrictEqual([])
    })
  })

  it('Should report server error for shapes', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, { throws: Error('Not found') }, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(expectedServerError('SHAPES_URL', 'http://localhost:4040/api/curfew/export_shapes/deeprows'))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.shapes).toStrictEqual([])
    })
  })

  it('Should report server error for multiple endpoints', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { throws: Error('Not found') }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, { throws: Error('Not found') }, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(2)
      expect(domain.notifications[0].message)
        .toStrictEqual(expectedServerError('ASSOCIATIONS_URL', 'http://localhost:4040/api/curfew/export_associations/deeprows'))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.associations).toStrictEqual([])
      expect(domain.notifications[1].message)
        .toStrictEqual(expectedServerError('SHAPES_URL', 'http://localhost:4040/api/curfew/export_shapes/deeprows'))
      expect(domain.notifications[1].type).toStrictEqual('error')
      expect(domain.shapes).toStrictEqual([])
    })
  })

  it('Should report 404 error for events', () => {
    fetchMock.once(EVENT_DATA_URL, { body: serverErrorBody, status: 404 }, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        expectedHttpError('EVENTS_URL', 'http://localhost:4040/api/curfew/export_events/deeprows'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.events).toEqual([serverErrorBody])
    })
  })

  it('Should report 404 error for sources', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, { body: serverErrorBody, status: 404 }, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        expectedHttpError('SOURCES_URL', 'http://localhost:4040/api/curfew/export_sources/deeprows'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.sources).toStrictEqual(serverErrorBody)
    })
  })

  it('Should report 404 error for associations', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { body: serverErrorBody, status: 404 }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        expectedHttpError('ASSOCIATIONS_URL', 'http://localhost:4040/api/curfew/export_associations/deeprows'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.associations).toStrictEqual(serverErrorBody)
    })
  })

  it('Should report 404 error for sites', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, { body: serverErrorBody, status: 404 }, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        expectedHttpError('SITES_URL', 'http://localhost:4040/api/curfew/export_sites/deeprows'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.sites).toStrictEqual(serverErrorBody)
    })
  })

  it('Should report 404 error for shapes', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, { body: serverErrorBody, status: 404 }, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        expectedHttpError('SHAPES_URL', 'http://localhost:4040/api/curfew/export_shapes/deeprows'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.shapes).toStrictEqual(serverErrorBody)
    })
  })

  it('Should report 404 error for multiple errors', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { body: serverErrorBody, status: 404 }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, { body: serverErrorBody, status: 404 }, { overwriteRoutes: true })

    return fetchDomain(features)().then(domain => {
      expect(domain.notifications.length).toEqual(2)
      expect(domain.notifications[0].message.toString()).toEqual(
        expectedHttpError('ASSOCIATIONS_URL', 'http://localhost:4040/api/curfew/export_associations/deeprows'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.notifications[1].message.toString()).toEqual(
        expectedHttpError('SHAPES_URL', 'http://localhost:4040/api/curfew/export_shapes/deeprows'))
      expect(domain.notifications[1].type).toEqual('error')
      expect(domain.associations).toStrictEqual(serverErrorBody)
      expect(domain.shapes).toStrictEqual(serverErrorBody)
    })
  })

  //  it('Should report 404 error for multiple errors', () => {

  //  it('Should work with multiple event arrays', () => {

  // urlFromEnv
})
