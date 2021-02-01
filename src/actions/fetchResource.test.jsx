import fetchMock from 'fetch-mock-jest'
import { fetchResource } from './fetchResource'

const URL = 'http://localhost:4040/api/curfew/export_events/deeprows'

const errorHandler = (error) => {
  expect(error.message).toEqual('Not Found, HTTP status: 404 for URL: http://localhost:4040/api/curfew/export_events/deeprows')
}

describe('Fetch Resource: http requests', () => {
  beforeEach(() => {
    fetchMock.reset()
  })

  it('Should return a successful http request', () => {
    fetchMock.once(URL, { success: true }, { overwriteRoutes: false })
    return fetchResource(URL, errorHandler).then(data => {
      expect(data).toStrictEqual({ success: true })
    })
  })

  it('Should return a 404 error http request', () => {
    fetchMock.once(URL, { body: '{}', status: 404 }, { overwriteRoutes: false })
    return fetchResource(URL, errorHandler).then(data => {
      expect(data).toStrictEqual(undefined)
    })
  })

  it('Should return error http request', () => {
    fetchMock.once(URL, { throws: Error('Not found') }, { overwriteRoutes: false })
    return fetchResource(URL, errorHandler).then(data => {
      expect(data).toStrictEqual(undefined)
    })
  })
})
