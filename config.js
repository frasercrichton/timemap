//         anchor: [51.5113583, -0.3774002]
//  minZoom: 16,
// maxZoom: 16,

module.exports = {
  title: "example",
  display_title: "example",
  SERVER_ROOT: "http://localhost:4040",
  EVENT_EXT: "/api/example/welfare_export_events/deeprows",
  CATEGORY_EXT: "/api/example/welfare_export_categories/rows",
  NARRATIVE_EXT: "/api/example/welfare_export_narratives/rows",
  SOURCES_EXT: "/api/example/welfare_export_sources/deepids",
  TAGS_EXT: "/api/example/welfare_export_tags/tree",
  SITES_EXT: "/api/example/welfare_export_sites/rows",
  SHAPES_EXT: "/api/example/export_shapes/columns",
  INCOMING_DATETIME_FORMAT: "%d/%m/%YT%H:%M",
  MAPBOX_TOKEN: 'pk.eyJ1IjoiZnJhc2VyYyIsImEiOiJjazJ2dWx6bHMwOGRiM2RueGJoZnhyazhnIn0._uqEizdOhsnp3SLJEK1iVw',
  features: {
    USE_COVER: true,
    USE_TAGS: false,
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
//      bounds: null,
  //    maxBounds: [[180, -180], [-180, 180]]
    
        // -39.8585203,172.9617603
        // -42.056832,179.1998063
        // Wellington: [-41.2442852, 174.6217707] 
        //timeline.dimensions
        anchor: [-41.2442852, 174.6217707]
      },
      cover: {
        title: 'The Moral Drift',
        subtitle: 'An investigation into historic abuse in State Care in Aotearoa/New Zealand',
        subsubtitle: 'March 2020',
        description: "Aotearoa/New Zealand has one of the highest rates of incarceration in the developed world. Aotearoa’s expanding prison system mirrors many countries with one difference; 50% of the prison population are indigenous Māori. Māori, however, are only 15% of Aotearoa's population. \n\nThe Moral Drift is an investigation into the factors contributing to these statistics, recognising that child placement in state care increases the risk of later presenting in the prison population. \n\nThe recommendations of the 1954 Mazengarb Report increased the powers of social services and saw the uplift of children into state, foster and psychiatric care. An estimated 100 000 children experienced unprecedented levels of psychological, physical and sexual abuse whilst in care. 50% of those children were Māori. Now, intergenerational trauma combined with a contemporary moral panic over social services’ intervention sees the uplift of children at unprecedented levels. These children are disproportionately Māori."
      },
      timeline: {
        zoomLevels: [
          { label: '50 Years', duration: 2.628e+7 },
          { label: '5 Years', duration: 2.628e+6 },
          { label: '1 Year', duration: 525600 },
        ],
        range: ['1850-12-01T12:00:00', '2020-12-01T12:00:00'],
        rangeLimits: ['1850-12-01T12:00:00', '2020-12-01T12:00:00']
      }
    },
    ui: {
      tiles: 'fraserc/ck8b3t4jz0m401jr0l0e1o631',
      style: {
        categories:
        {
          'Legislation': '#939393',
          'Child Welfare': '#bdbdbd',
          'Psychiatric Care': '#545454',
          'Mass Incarceration': '#F5F5F5',
        }  
      }
    }
  }
}

//state.ui.style.selectedEvents
  //  selected: state.app.selected,
  //     language: state.app.language,
  //     timeline: state.app.timeline,
  //     narrative: state.app.narrative
//   this.props.event.type === 'Structure'