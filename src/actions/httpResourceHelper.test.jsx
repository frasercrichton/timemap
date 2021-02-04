import fetchMock from 'fetch-mock-jest'
import { httpResourceHelper } from './httpResourceHelper'

const URL = 'http://localhost:4040/api/curfew/export_events/deeprows'
const httpErrorMessage = 'Error Message: The resource \'deeprows\' does not exists in the tab \'export_sources\' in this sheet. Status: Not Found, Status code: 404 for URL: http://localhost:4040/api/curfew/export_events/deeprows - this could be an incorrect url.'

const httpErrorHandler = (error) => {
  expect(error.message).toEqual(httpErrorMessage)
}

const serverErrorHandler = (error) => {
  expect(error.message).toEqual('Status: server error Not found, for URL: http://localhost:4040/api/curfew/export_events/deeprows - is the server running?')
}

describe('HTTP Resource Helper: http requests', () => {
  beforeEach(() => {
    fetchMock.reset()
  })

  it('Should return a successful http request', () => {
    fetchMock.once(URL, { success: true }, { overwriteRoutes: false })
    return httpResourceHelper(URL, httpErrorHandler, []).then(data => {
      expect(data).toStrictEqual({ success: true })
    })
  })

  it('Should return a 404 error and an error message', () => {
    fetchMock.once(URL, { body: '{"error":"The resource \'deeprows\' does not exists in the tab \'export_sources\' in this sheet."}', status: 404 }, { overwriteRoutes: false })
    return httpResourceHelper(URL, httpErrorHandler, []).then(data => {
      expect(data).toEqual({ error: "The resource 'deeprows' does not exists in the tab 'export_sources' in this sheet." })
    })
  })

  it('Should return a general server error i.e. the server is down', () => {
    fetchMock.once(URL, { throws: new Error('Not found') }, { overwriteRoutes: false })
    return httpResourceHelper(URL, serverErrorHandler, []).then(data => {
      expect(data).toEqual([])
    })
  })
})
