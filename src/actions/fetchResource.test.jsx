import fetchMock from 'fetch-mock-jest'
import { fetchResource } from './fetchResource'

const URL = 'http://localhost:4040/api/curfew/export_events/deeprows'
const shapesError = 'Something went wrong fetching shapes. Check the URL or try disabling them in the config file.'

const errorHandler = (error) => {
  expect(error.message).toEqual('[Http status: 404 error: Not Found]')
}

describe('Fetch Resource: http requests', () => {
  beforeEach(() => {
    // jest.mock('./urlFromEnv', () => ({
    //   getUrlFromProcessEnv: jest.fn().mockImplementation(() => [process.env.SERVER_ROOT = 'http://localhost:4040'])
    // }))

    // const getUrlFromProcessEnvMock = jest.spyOn(getUrlFromProcessEnv, 'getUrlFromProcessEnv')
    // const mockDispatch = jest.fn().mockImplementation(() => {})
    // getUrlFromProcessEnv.mockClear()
    // getUrlFromProcessEnv.mockReturnValue(['my url'])

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
})
