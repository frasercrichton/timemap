import { envVarsLookup } from './envVarsLookup'

const OLD_ENV = process.env
const emptyArrayErrorMessage = 'EVENTS_EXT expected an array of items e.g. EVENTS_EXT: [\'/api/your-server/export_events/deeprows\',\'/api/your-server/export_other_events/deeprows\'].'

const missingUrlErrorMessage = 'EVENTS_EXT was not found - are you sure you have defined it? e.g. EVENTS_EXT: \'/api/your-server/export_events/deeprows\'.'
describe('envVarsLookup : retrieve environment variables', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  it('Should successfully retrieve a full url from a process.env var', () => {
    process.env.REACT_APP_SERVER_ROOT = 'http://localhost:4040'
    process.env.EVENTS_EXT = '/api/curfew/export_events/deeprows'
    const url = envVarsLookup('EVENTS_EXT')
    expect(url).toEqual('http://localhost:4040/api/curfew/export_events/deeprows')
  })

  it('Should successfully retrieve a url from an array of process.env var', () => {
    process.env.REACT_APP_SERVER_ROOT = 'http://localhost:4040'
    process.env.EVENTS_EXT = [
      '/api/curfew/export_events/deeprows',
      '/api/curfew/export_sources/deeprows'
    ]
    const url = envVarsLookup('EVENTS_EXT')
    expect(url).toEqual([
      'http://localhost:4040/api/curfew/export_events/deeprows',
      'http://localhost:4040/api/curfew/export_sources/deeprows'
    ])
  })

  it('Should tell you if you have not defined the data server root', () => {
    process.env.REACT_APP_EVENTS_EXT = '/api/curfew/export_events/deeprows'
    expect(() => envVarsLookup('REACT_APP_EVENTS_EXT'))
      .toThrow(new Error('The Dataserver url is missing - have you configured it correctly? e.g. SERVER_ROOT: http://localhost:8080.'))
  })

  it('Should tell you if the env var is not present', () => {
    process.env.REACT_APP_SERVER_ROOT = 'http://localhost:4040'
    expect(() => envVarsLookup('EVENTS_EXT')).toThrow(new Error(missingUrlErrorMessage))
  })

  it('Should tell you if the env var is blank', () => {
    process.env.REACT_APP_SERVER_ROOT = 'http://localhost:4040'
    process.env.EVENTS_EXT = ''
    expect(() => envVarsLookup('EVENTS_EXT')).toThrow(new Error(missingUrlErrorMessage))
  })

  it('Should not tell you anything for a missing item in the array if it is an array', () => {
    process.env.REACT_APP_SERVER_ROOT = 'http://localhost:4040'
    process.env.EVENTS_EXT = [
      '/api/curfew/export_events/deeprows'
    ]
    const url = envVarsLookup('EVENTS_EXT')
    expect(url).toEqual(['http://localhost:4040/api/curfew/export_events/deeprows'])
  })

  it('Should tell you if you have defined the server root as blank', () => {
    process.env.REACT_APP_SERVER_ROOT = ''
    process.env.EVENTS_EXT = '/api/curfew/export_events/deeprows'
    expect(() => envVarsLookup('EVENTS_EXT'))
      .toThrow(new Error('The Dataserver url is missing - have you configured it correctly? e.g. SERVER_ROOT: http://localhost:8080.'))
  })

  it('Should tell you if the domain extension is blank in array', () => {
    process.env.REACT_APP_SERVER_ROOT = 'http://localhost:4040'
    process.env.EVENTS_EXT = [
      '',
      '/api/curfew/export_events/deeprows'
    ]
    expect(() => envVarsLookup('EVENTS_EXT'))
      .toThrow(new Error(emptyArrayErrorMessage))
  })

  it('Should tell you if the domain extension array is empty', () => {
    process.env.REACT_APP_SERVER_ROOT = 'http://localhost:4040'
    process.env.EVENTS_EXT = []
    expect(() => envVarsLookup('EVENTS_EXT'))
      .toThrow(new Error(emptyArrayErrorMessage))
  })
})
