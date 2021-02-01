const serverRequestVarsLookup = (domainExtension) => {
  const emptyArrayErrorMessage = `${domainExtension} expected an array of items e.g. EVENTS_EXT: ['/api/your-server/export_events/deeprows','/api/your-server/export_other_events/deeprows'].`

  if (!process.env.SERVER_ROOT || process.env.SERVER_ROOT.trim() === '') {
    throw new Error('The Dataserver url is missing - have you configured it correctly? e.g. SERVER_ROOT: http://localhost:8080.')
  }
  if (!process.env[domainExtension] || process.env[domainExtension] === '') {
    throw new Error(`${domainExtension} was not found - are you sure you have defined it? e.g. EVENTS_EXT: '/api/your-server/export_events/deeprows'.`)
  }

  const serverRoot = process.env.SERVER_ROOT
  const processEnvExtension = process.env[domainExtension]

  const validateExtension = (item) => {
    if (item.trim() === '') {
      throw new Error(emptyArrayErrorMessage)
    }
    return item
  }

  const parseEnvVarArray = (envVarArray) => {
    if (envVarArray.length === 0) {
      throw new Error(emptyArrayErrorMessage)
    }
    return envVarArray.map((suffix) => `${serverRoot}${validateExtension(suffix)}`)
  }

  return (Array.isArray(processEnvExtension))

    ? parseEnvVarArray(processEnvExtension)
    : `${serverRoot}${processEnvExtension}`
}

exports.serverRequestVarsLookup = serverRequestVarsLookup
