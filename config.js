module.exports = {
  title: 'example',
  display_title: 'example',
  SERVER_ROOT: 'https://datasheet-server-dot-forensic-265906.appspot.com',
  EVENTS_EXT: '/api/timemap_data/export_events/deeprows',
  CATEGORIES_EXT: '/api/timemap_data/export_categories/rows',
  FILTERS_EXT: '/api/timemap_data/export_filters/tree',
  SOURCES_EXT: '/api/timemap_data/export_sources/deepids',
  NARRATIVE_EXT: '',
  SITES_EXT: '',
  SHAPES_EXT: '',
  DATE_FMT: 'MM/DD/YYYY',
  TIME_FMT: 'hh:mm',
  // MAPBOX_TOKEN: 'pk.YOUR_MAPBOX_TOKEN',
  store: {
    app: {
      map: {
        anchor: [31.356397, 34.784818]
      }
    },
    ui: {
      // tiles: 'your-mapbox-account-name/x5678-map-id'
    },
    features: {
      USE_CATEGORIES: false,
      CATEGORIES_AS_FILTERS: false,
      USE_FILTERS: true,
      FILTERS_AS_NARRATIVES: false,
      USE_NARRATIVES: false,
      USE_SOURCES: true,
      USE_COVER: false,
      USE_SEARCH: false,
      USE_SITES: false,
      USE_SHAPES: false,
      GRAPH_NONLOCATED: false,
      HIGHLIGHT_GROUPS: false
    }
  }
}
