import fetchMock from 'fetch-mock-jest'
import { fetchUrl, notifications } from './index'
import IncidentBuilderParsed from '../_testHelpers/IncidentBuilderParsed'

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
