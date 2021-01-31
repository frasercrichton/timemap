import fetchMock from 'fetch-mock-jest'
import { fetchUrl, fetchDomain, eventPromise, notifications } from './index'
import IncidentBuilderParsed from '../_testHelpers/IncidentBuilderParsed'

const timelineIncident = { timeline: new IncidentBuilderParsed().build() }

const narrativeIncident = { narrative: { label: 'Curfew', description: 'Narrative Description' } }

const locationIncident = { location: new IncidentBuilderParsed().withLocation('London').build() }

const incidents = [
  new IncidentBuilderParsed().build(),
  new IncidentBuilderParsed()
    .withDateTime('2000-05-10T13:00:00.000Z').build(),
  new IncidentBuilderParsed()
    .withLocation('London')
    .withNarratives(['Curfew']).build(),
  new IncidentBuilderParsed()
    .withLocation('London')
    .withNarratives(['Narrative 2', 'Curfew']).build()]

const incidentsSortable = [
  new IncidentBuilderParsed()
    .withLocation('London')
    .withDateTime('2000-05-10T13:00:00.000Z').build(),
  new IncidentBuilderParsed()
    .withLocation('London')
    .withDateTime('2001-05-10T13:00:00.000Z').build(),
  new IncidentBuilderParsed()
    .withDateTime('2001-05-11T13:00:00.000Z')
    .withLocation('London')
    .withNarratives(['Curfew']).build(),
  new IncidentBuilderParsed()
    .withDateTime('2000-05-10T12:00:00.000Z')
    .withLocation('London')
    .withNarratives(['Narrative 2', 'Curfew']).build()]

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

const EVENT_DATA_URL = 'http://localhost:4040/api/curfew/export_events/deeprows'

describe('Fetch Domain: Selected Incidents', () => {
  beforeEach(() => {
    fetchMock.reset()
  })
  it('Should make a successful request', async () => {
    fetchMock.mock(EVENT_DATA_URL, JSON.stringify(incidents))
    return fetchUrl(EVENT_DATA_URL).then(data => {
      expect(data).toStrictEqual(incidents)
    })
  })

  it('Should return an error on unsuccessful', async () => {
    fetchMock.mock(EVENT_DATA_URL, { throws: 'Not found' })
    return fetchUrl(EVENT_DATA_URL).then(data => {
      expect(notifications.length).toEqual(1)
      expect(notifications).toStrictEqual([{ message: 'Not found', type: 'error' }])
      expect(data).toStrictEqual(undefined)
    })
  })
})
