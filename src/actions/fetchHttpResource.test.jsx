import fetchMock from 'fetch-mock-jest'
import { fetchHttpResource } from './fetchHttpResource'

const URL = 'http://localhost:4040/api/curfew/export_events/deeprows'

const httpErrorHandler = (error) => {
  expect(error.message).toEqual('Not Found, HTTP status: 404 for URL: http://localhost:4040/api/curfew/export_events/deeprows - this could be an incorrect url.')
}

const serverErrorHandler = (error) => {
  expect(error.message).toEqual('Server error Not found, for URL: http://localhost:4040/api/curfew/export_events/deeprows - is the server running at that url address?')
}

describe('Fetch Resource: http requests', () => {
  beforeEach(() => {
    fetchMock.reset()
  })

  it('Should return a successful http request', () => {
    fetchMock.once(URL, { success: true }, { overwriteRoutes: false })
    return fetchHttpResource(URL, httpErrorHandler).then(data => {
      expect(data).toStrictEqual({ success: true })
    })
  })

  it('Should return a 404 error http request', () => {
    fetchMock.once(URL, { body: '{}', status: 404 }, { overwriteRoutes: false })
    return fetchHttpResource(URL, httpErrorHandler).then(data => {
      expect(data).toEqual(undefined)
    })
  })

  it('Should return error http request', () => {
    fetchMock.once(URL, { throws: new Error('Not found') }, { overwriteRoutes: false })
    return fetchHttpResource(URL, serverErrorHandler).then(data => {
      expect(data).toEqual(undefined)
    })
  })
})
