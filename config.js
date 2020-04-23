module.exports = {
  title: 'The Moral Drift',
  display_title: 'The Moral Drift',
  SERVER_ROOT: 'http://localhost:4040',
  EVENT_EXT: '/api/forensic/welfare_export_events/deeprows',
  CATEGORY_EXT: '/api/forensic/welfare_export_categories/rows',
  NARRATIVE_EXT: '/api/forensic/welfare_export_narratives/rows',
  SOURCES_EXT: '/api/forensic/welfare_export_sources/deepids',
  TAGS_EXT: '/api/forensic/welfare_export_tags/tree',
  SITES_EXT: '/api/forensic/welfare_export_sites/rows',
  SHAPES_EXT: '/api/forensic/export_shapes/columns',
  INCOMING_DATETIME_FORMAT: '%d/%m/%YT%H:%M',
  MAPBOX_TOKEN: 'pk.eyJ1IjoiZnJhc2VyYyIsImEiOiJjazJ2dWx6bHMwOGRiM2RueGJoZnhyazhnIn0._uqEizdOhsnp3SLJEK1iVw',
  features: {
    USE_COVER: true,
    USE_TAGS: true,
    USE_SEARCH: true,
    USE_SITES: true,
    USE_SOURCES: true,
    USE_SHAPES: false,
    CATEGORIES_AS_TAGS: true
  },
  store: {
    app: {
      map: {
        minZoom: 5,
        maxZoom: 15,
        startZoom: 7,
        maxBounds: [-41.244, 174.621],
        anchor: [-41.2442852, 174.6217707]
      },
      timeline: {
        zoomLevels: [
          { label: 'All Years', duration: 9.461e+7 },
          { label: '50 Years', duration: 2.628e+7 },
          { label: '5 Years', duration: 2.628e+6 },
          { label: '1 Year', duration: 525600 }
        ],
        range: ['1840-12-01T12:00:00', '2020-12-01T12:00:00'],
        rangeLimits: ['1840-12-01T12:00:00', '2020-12-01T12:00:00']
      },
      cover: {
        title: 'The Moral Drift',
        subtitle: 'An investigation into historic abuse in State Care in Aotearoa/New Zealand',
        subsubtitle: 'March 2020',
        description: 'Aotearoa/New Zealand has one of the highest rates of incarceration in the developed world. Aotearoa’s expanding prison system mirrors many countries with one difference; 50% of the prison population are indigenous Māori. Māori, however, are only 15% of Aotearoa\'s population. \n\nThe Moral Drift is an investigation into the factors contributing to these statistics, recognising that child placement in state care increases the risk of later presenting in the prison population. \n\nThe recommendations of the 1954 Mazengarb Report increased the powers of social services and saw the uplift of children into state, foster and psychiatric care. An estimated 100 000 children experienced unprecedented levels of psychological, physical and sexual abuse whilst in care. 50% of those children were Māori. Now, intergenerational trauma combined with a contemporary moral panic over social services’ intervention sees the uplift of children at unprecedented levels. These children are disproportionately Māori.'
      }
    },
    ui: {
      tiles: 'fraserc/ck8b3t4jz0m401jr0l0e1o631',
      style: {
        categories:
        {
          'Legislation': '#F5F5F5',
          'Child Welfare': '#bbbbbb',
          'Psychiatric Care': '#636363',
          'Mass Incarceration': '#454545'
        },
        narratives: {
          default: {
            stroke: 'none'
          }
        },
        shapes: {
          default: {
            stroke: 'blue',
            strokeWidth: 3,
            opacity: 0.9
          }
        }
      }
    }
  }
}
