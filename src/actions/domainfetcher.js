import serverRequestConfiguration from "./serverRequestConfiguration";
import { httpResourceHelper } from "./httpResourceHelper";
// this needs to deal with missing features so validate against the supported features
// const supportedFeatures = ['USE_EVENTS', 'USE_ASSOCIATIONS', 'USE_SOURCES', 'USE_SITES', 'USE_SHAPES']

const requestErrorMessage = (url, domain, error) =>
  `The '${domain}' returned ${error.message}`;

const fetchDomain = (features) => {
  const { USE_ASSOCIATIONS, USE_SOURCES, USE_SITES, USE_SHAPES } = features;

  const activeFeatures = [
    "USE_EVENTS",
    "USE_SOURCES",
    "USE_ASSOCIATIONS",
    "USE_SITES",
    "USE_SHAPES",
  ];

  // test this
  // const { configuration, errors } = serverRequestConfiguration('NO_ARRAY')
  const { configuration, errors } = serverRequestConfiguration(activeFeatures);
  const {
    SOURCES_URL,
    ASSOCIATIONS_URL,
    SHAPES_URL,
    SITES_URL,
  } = configuration;

  const notifications = [...errors];
  // if there are errors don't go any further
  const handleError = (message) => {
    notifications.push({
      message,
      type: "error",
    });
  };

  const fetchDomainHttpResource = (url, domain) =>
    httpResourceHelper(
      url,
      (error) => handleError(requestErrorMessage(url, domain, error)),
      []
    );

  return () => {
    const EVENT_DATA_URL = [
      "http://localhost:4040/api/curfew/export_events/deeprows",
    ];

    // everything should be a list
    // events are mandatory?
    const eventsPromise = Promise.all(
      EVENT_DATA_URL.map((url) => fetchDomainHttpResource(url, "EVENTS_URL"))
    ).then((results) => results.flatMap((event) => event));

    let associationsPromise = Promise.resolve([]);
    if (USE_ASSOCIATIONS) {
      if (ASSOCIATIONS_URL) {
        associationsPromise = fetchDomainHttpResource(
          ASSOCIATIONS_URL,
          "ASSOCIATIONS_URL"
        );
      }
    }

    let sourcesPromise = Promise.resolve([]);
    if (USE_SOURCES) {
      if (SOURCES_URL) {
        sourcesPromise = fetchDomainHttpResource(SOURCES_URL, "SOURCES_URL");
      }
    }

    let sitesPromise = Promise.resolve([]);
    if (USE_SITES) {
      if (SITES_URL) {
        sitesPromise = fetchDomainHttpResource(SITES_URL, "SITES_URL");
      }
    }

    let shapesPromise = Promise.resolve([]);
    if (USE_SHAPES) {
      if (SHAPES_URL) {
        shapesPromise = fetchDomainHttpResource(SHAPES_URL, "SHAPES_URL");
      }
    }

    return Promise.all([
      eventsPromise,
      associationsPromise,
      sourcesPromise,
      sitesPromise,
      shapesPromise,
    ])
      .then((response) => {
        // no magic numbers
        const result = {
          events: response[0],
          associations: response[1],
          sources: response[2],
          sites: response[3],
          shapes: response[4],
          notifications,
        };

        if (notifications.length > 0) {
          const errorList = notifications.map(
            (error) => `\n\n${error.message}`
          );
          throw new Error(
            `Some URLs returned negative. If you are in development, check the server is running ${errorList}`
          );
        }
        return result;
      })
      .catch((error) => {
        console.log("error", error.message);
        // TODO: handle this appropriately in React hierarchy
        // rather than alert would a panel not be better
        // alert(error.message)
      });
  };
};

export default fetchDomain;
