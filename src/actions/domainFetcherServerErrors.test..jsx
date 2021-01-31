import fetchMock from 'fetch-mock-jest'

import fetchDomain from './domainfetcher'

// import { getUrlFromProcessEnv } from './urlFromEnv'
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

const shapesError = 'Something went wrong fetching shapes. Check the URL or try disabling them in the config file.'
const configError = (domain) => `USE_${domain} is true, but you have not provided a ${domain}_EXT`

const features = { USE_ASSOCIATIONS: true, USE_SOURCES: true, USE_SITES: true, USE_SHAPES: true }

const errorMessage = (url, domain, error) => `The url: ${url} for: '${domain}' returned a server error: Error: ${error} this could be an incorrect url configuration or a server issue.`

const OLD_ENV = process.env

const urls = {
  EVENT_DATA_URL: ['http://localhost:4040/api/curfew/export_events/deeprows'],
  ASSOCIATIONS_URL: 'http://localhost:4040/api/curfew/export_associations/deeprows',
  SOURCES_URL: 'http://localhost:4040/api/curfew/export_sources/deeprows',
  SITES_URL: 'http://localhost:4040/api/curfew/export_sites/deeprows',
  SHAPES_URL: 'http://localhost:4040/api/curfew/export_shapes/deeprows'
}

describe('Fetch Domain: Selected Incidents', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.SERVER_ROOT = 'http://localhost:4040'
    process.env.EVENTS_EXT = '/api/curfew/export_events/deeprows'

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

    return fetchDomain(features, urls, urls)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should return an error for a missing associations url', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    const missingUrls = {
      EVENT_DATA_URL: ['http://localhost:4040/api/curfew/export_events/deeprows'],
      // ASSOCIATIONS_URL: 'http://localhost:4040/api/curfew/export_associations/deeprows',
      SOURCES_URL: 'http://localhost:4040/api/curfew/export_sources/deeprows',
      SITES_URL: 'http://localhost:4040/api/curfew/export_sites/deeprows',
      SHAPES_URL: 'http://localhost:4040/api/curfew/export_shapes/deeprows'
    }

    return fetchDomain(features, missingUrls)().then(domain => {
      expect(domain.notifications).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should not return the associations feature', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    const missingFeatures = { USE_ASSOCIATIONS: false, USE_SOURCES: true, USE_SITES: true, USE_SHAPES: true }

    return fetchDomain(missingFeatures, urls)().then(domain => {
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

    return fetchDomain(missingFeatures, urls)().then(domain => {
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

    return fetchDomain(missingFeatures, urls)().then(domain => {
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

    return fetchDomain(missingFeatures, urls)().then(domain => {
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

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('http://localhost:4040/api/curfew/export_events/deeprows', 'events', 'Not found'))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.events).toStrictEqual([])
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should report error for sources', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, { throws: Error('Not found') }, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('http://localhost:4040/api/curfew/export_sources/deeprows', 'sources', 'Not found'))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual([])
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should report error for associations', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { throws: Error('Not found') }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('http://localhost:4040/api/curfew/export_associations/deeprows', 'associations', 'Not found'))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.associations).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })
  it('Should report error for sites', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, { throws: Error('Not found') }, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('http://localhost:4040/api/curfew/export_sites/deeprows', 'sites', 'Not found'))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.sites).toStrictEqual([])
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should report error for shapes', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, { throws: Error('Not found') }, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message)
        .toStrictEqual(errorMessage('http://localhost:4040/api/curfew/export_shapes/deeprows', 'shapes', 'Not found'))
      expect(domain.notifications[0].type).toStrictEqual('error')
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual([])
    })
  })

  it('Should report 404 error for events', () => {
    fetchMock.once(EVENT_DATA_URL, { body: '{}', status: 404 }, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('http://localhost:4040/api/curfew/export_events/deeprows', 'events', '[Http status: 404 error: Not Found]'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.events).toStrictEqual([])
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should report 404 error for sources', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, { body: '{}', status: 404 }, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('http://localhost:4040/api/curfew/export_sources/deeprows', 'sources', '[Http status: 404 error: Not Found]'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual([])
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should report 404 error for associations', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { body: '{}', status: 404 }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('http://localhost:4040/api/curfew/export_associations/deeprows', 'associations', '[Http status: 404 error: Not Found]'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.associations).toStrictEqual([])
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should report 404 error for sites', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, { body: '{}', status: 404 }, { overwriteRoutes: true })
      .once(SHAPES_URL, shapes, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('http://localhost:4040/api/curfew/export_sites/deeprows', 'sites', '[Http status: 404 error: Not Found]'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.sites).toStrictEqual([])
      expect(domain.shapes).toStrictEqual(shapes)
    })
  })

  it('Should report 404 error for shapes', () => {
    fetchMock.once(EVENT_DATA_URL, incidents, { overwriteRoutes: false })
      .once(SOURCES_URL, sources, { overwriteRoutes: true })
      .once(ASSOCIATIONS_URL, { associations: 'x' }, { overwriteRoutes: true })
      .once(SITES_URL, sites, { overwriteRoutes: true })
      .once(SHAPES_URL, { body: '{}', status: 404 }, { overwriteRoutes: true })

    return fetchDomain(features, urls)().then(domain => {
      expect(domain.notifications.length).toEqual(1)
      expect(domain.notifications[0].message.toString()).toEqual(
        errorMessage('http://localhost:4040/api/curfew/export_shapes/deeprows', 'shapes', '[Http status: 404 error: Not Found]'))
      expect(domain.notifications[0].type).toEqual('error')
      expect(domain.associations).toStrictEqual({ associations: 'x' })
      expect(domain.events).toStrictEqual(incidents)
      expect(domain.sources).toStrictEqual(sources)
      expect(domain.sites).toStrictEqual(sites)
      expect(domain.shapes).toStrictEqual([])
    })
  })
  //  it('Should report 404 error for multiple errors', () => {

  //  it('Should work with multiple event arrays', () => {

  // urlFromEnv
})
