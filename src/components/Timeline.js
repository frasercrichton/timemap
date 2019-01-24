/* global d3 */
import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../selectors'
import hash from 'object-hash'

import copy from '../js/data/copy.json'
import { formatterWithYear, parseDate } from '../js/utilities'
import Header from './presentational/Timeline/Header'
import Axis from './TimelineAxis'
import Clip from './presentational/Timeline/Clip'
import Handles from './presentational/Timeline/Handles'
import ZoomControls from './presentational/Timeline/ZoomControls'
import Markers from './presentational/Timeline/Markers'
import Events from './presentational/Timeline/Events'
import Categories from './TimelineCategories'

class Timeline extends React.Component {
  constructor (props) {
    super(props)
    this.styleDatetime = this.styleDatetime.bind(this)
    this.getDatetimeX = this.getDatetimeX.bind(this)
    this.onApplyZoom = this.onApplyZoom.bind(this)
    this.svgRef = React.createRef()
    this.state = {
      isFolded: false,
      dims: props.app.timeline.dimensions,
      scaleX: null,
      scaleY: null,
      timerange: [null, null],
      dragPos0: null,
      transitionDuration: 300
    }
  }

  componentDidMount () {
    this.computeDims()
    this.addEventListeners()
  }

  componentWillReceiveProps (nextProps) {
    if (hash(nextProps) !== hash(this.props)) {
      this.setState({
        timerange: nextProps.app.timeline.range,
        scaleX: this.makeScaleX()
      })
    }

    if (hash(nextProps.domain.categories) !== hash(this.props.domain.categories)) {
      this.setState({
        scaleY: this.makeScaleY(nextProps.domain.categories)
      })
    }

    if (hash(nextProps.domain.selected) !== hash(this.props.domain.selected)) {
      if (!!nextProps.domain.selected && nextProps.domain.selected.length > 0) {
        this.onCenterTime(parseDate(nextProps.domain.selected[0].timestamp))
      }
    }
  }

  addEventListeners () {
    window.addEventListener('resize', () => { this.computeDims() })
    let element = document.querySelector('.timeline-wrapper')
    element.addEventListener('transitionend', (event) => {
      this.computeDims()
    })
  }

  makeScaleX () {
    return d3.scaleTime()
      .domain(this.state.timerange)
      .range([this.state.dims.margin_left, this.state.dims.width - this.state.dims.width_controls])
  }

  makeScaleY (categories) {
    const tickHeight = 15
    const catsYpos = categories.map((g, i) => (i + 1) * this.state.dims.trackHeight / categories.length + tickHeight / 2)
    return d3.scaleOrdinal()
      .domain(categories)
      .range(catsYpos)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.timerange !== this.state.timerange) {
      this.setState({ scaleX: this.makeScaleX() })
    }
  }

  /**
   * Returns the time scale (x) extent in minutes
   */
  getTimeScaleExtent () {
    if (!this.state.scaleX) return 0
    const timeDomain = this.state.scaleX.domain()
    return (timeDomain[1].getTime() - timeDomain[0].getTime()) / 60000
  }

  onClickArrow () {
    this.setState((prevState, props) => {
      return { isFolded: !prevState.isFolded }
    })
  }

  computeDims () {
    const dom = this.props.ui.dom.timeline
    if (document.querySelector(`#${dom}`) !== null) {
      const boundingClient = document.querySelector(`#${dom}`).getBoundingClientRect()

      this.setState({
        dims: {
          ...this.state.dims,
          width: boundingClient.width
        }
      },
      () => {
        this.setState({ scaleX: this.makeScaleX()
        })
      })
    }
  }

  /**
   * Shift time range by moving forward or backwards
   * @param {String} direction: 'forward' / 'backwards'
   */
  onMoveTime (direction) {
    this.props.methods.onSelect()
    const extent = this.getTimeScaleExtent()
    const newCentralTime = d3.timeMinute.offset(this.state.scaleX.domain()[0], extent / 2)

    // if forward
    let domain0 = newCentralTime
    let domainF = d3.timeMinute.offset(newCentralTime, extent)

    // if backwards
    if (direction === 'backwards') {
      domain0 = d3.timeMinute.offset(newCentralTime, -extent)
      domainF = newCentralTime
    }

    this.setState({ timerange: [domain0, domainF] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange)
    })
  }

  onCenterTime (newCentralTime) {
    const extent = this.getTimeScaleExtent() || 24 * 3600 * 3 // 3 days default extent

    const domain0 = d3.timeMinute.offset(newCentralTime, -extent / 2)
    const domainF = d3.timeMinute.offset(newCentralTime, +extent / 2)

    this.setState({ timerange: [domain0, domainF] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange)
    })
  }

  /**
   * Change display of time range
   * WITHOUT updating the store, or data shown.
   * Used for updates in the middle of a transition, for performance purposes
   */
  onSoftTimeRangeUpdate (timerange) {
    this.setState({ timerange })
  }

  /**
   * Apply zoom level to timeline
   * @param {object} zoom: zoom level from zoomLevels
   */
  onApplyZoom (zoom) {
    const extent = this.getTimeScaleExtent()
    const newCentralTime = d3.timeMinute.offset(this.state.scaleX.domain()[0], extent / 2)

    let newDomain0 = d3.timeMinute.offset(newCentralTime, -zoom.duration / 2)
    let newDomainF = d3.timeMinute.offset(newCentralTime, zoom.duration / 2)

    if (this.props.app.timeline.rangeLimits) {
      // If the store contains absolute time limits,
      // make sure the zoom doesn't go over them
      const minDate = parseDate(this.props.app.timeline.rangeLimits[0])
      const maxDate = parseDate(this.props.app.timeline.rangeLimits[1])

      if (newDomain0 < minDate) {
        newDomain0 = minDate
        newDomainF = d3.timeMinute.offset(newDomain0, zoom.duration)
      }
      if (newDomainF > maxDate) {
        newDomainF = maxDate
        newDomain0 = d3.timeMinute.offset(newDomainF, -zoom.duration)
      }
    }

    this.setState({ timerange: [
      newDomain0,
      newDomainF
    ] }, () => {
      this.props.methods.onUpdateTimerange(this.state.timerange)
    })
  }

  toggleTransition (isTransition) {
    this.setState({ transitionDuration: (isTransition) ? 300 : 0 })
  }

  /*
   * Setup drag behavior
   */
  onDragStart () {
    d3.event.sourceEvent.stopPropagation()
    this.setState({
      dragPos0: d3.event.x
    }, () => {
      this.toggleTransition(false)
    })
  }

  /*
   * Drag and update
   */
  onDrag () {
    const drag0 = this.state.scaleX.invert(this.state.dragPos0).getTime()
    const dragNow = this.state.scaleX.invert(d3.event.x).getTime()
    const timeShift = (drag0 - dragNow) / 1000

    const { range } = this.props.app.timeline
    let newDomain0 = d3.timeSecond.offset(range[0], timeShift)
    let newDomainF = d3.timeSecond.offset(range[1], timeShift)

    if (this.props.app.timeline.rangeLimits) {
      // If the store contains absolute time limits,
      // make sure the zoom doesn't go over them
      const minDate = parseDate(this.props.app.timeline.rangeLimits[0])
      const maxDate = parseDate(this.props.app.timeline.rangeLimits[1])

      newDomain0 = (newDomain0 < minDate) ? minDate : newDomain0
      newDomainF = (newDomainF > maxDate) ? maxDate : newDomainF
    }

    // Updates components without updating timerange
    this.onSoftTimeRangeUpdate([newDomain0, newDomainF])
  }

  /**
   * Stop dragging and update data
   */
  onDragEnd () {
    this.toggleTransition(true)
    this.props.methods.onUpdateTimerange(this.state.timerange)
  }

  getDatetimeX (dt) {
    return this.state.scaleX(parseDate(dt.timestamp))
  }

  /**
   * Determines additional styles on the <circle> for each timestamp. Note that
   * timestamp visualisation functions slightly differently from locations, as
   * a timestamp can be shown as multiple <circle>s (one per category of the
   * events contained therein). Thus the function below has a category as an
   * argumnent as well, in case timestamps ought to be styled per category.
   * A datetime consists of an array of events (see selectors). The function
   * also has full access to the domain and redux state to derive values if
   * necessary. The function should return an array, where the value at the
   * first index is a styles object for the SVG at the location, and the value
   * at the second index is an optional function that renders additional
   * components in the <g/> div.
   */
  styleDatetime (timestamp, category) {
    return []
  }

  render () {
    const { isNarrative, domain, app } = this.props
    let classes = `timeline-wrapper ${(this.state.isFolded) ? ' folded' : ''}`
    classes += (domain.activeNarrative !== null) ? ' narrative-mode' : ''
    const { dims } = this.state

    return (
      <div className={classes}>
        <Header
          title={copy[this.props.app.language].timeline.info}
          date0={formatterWithYear(this.state.timerange[0])}
          date1={formatterWithYear(this.state.timerange[1])}
          onClick={() => { this.onClickArrow() }}
          hideInfo={isNarrative}
        />
        <div className='timeline-content'>
          <div id={this.props.ui.dom.timeline} className='timeline'>
            <svg
              ref={this.svgRef}
              width={dims.width}
              height={dims.height}
            >
              <Clip
                dims={dims}
              />
              <Axis
                dims={dims}
                timerange={this.props.app.timerange}
                transitionDuration={this.state.transitionDuration}
                scaleX={this.state.scaleX}
              />
              <Categories
                dims={dims}
                getCategoryY={this.state.scaleY}
                onDragStart={() => { this.onDragStart() }}
                onDrag={() => { this.onDrag() }}
                onDragEnd={() => { this.onDragEnd() }}
                categories={this.props.domain.categories}
              />
              <Handles
                dims={dims}
                onMoveTime={(dir) => { this.onMoveTime(dir) }}
              />
              <ZoomControls
                extent={this.getTimeScaleExtent()}
                zoomLevels={this.props.app.timeline.zoomLevels}
                dims={dims}
                onApplyZoom={this.onApplyZoom}
              />
              <Markers
                selected={this.props.domain.selected}
                getEventX={this.getDatetimeX}
                getCategoryY={this.state.scaleY}
                transitionDuration={this.state.transitionDuration}
                styles={this.props.ui.styles}
              />
              <Events
                datetimes={this.props.domain.datetimes}
                styleDatetime={this.styleDatetime}
                narrative={this.props.domain.activeNarrative}
                getDatetimeX={this.getDatetimeX}
                getCategoryY={this.state.scaleY}
                getCategoryColor={this.props.methods.getCategoryColor}
                transitionDuration={this.state.transitionDuration}
                onSelect={this.props.methods.onSelect}
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    isNarrative: !!state.app.narrative,
    domain: {
      datetimes: selectors.selectDatetimes(state),
      categories: selectors.selectCategories(state),
      narratives: state.domain.narratives,
      selected: selectors.selectSelected(state),
      activeNarrative: selectors.selectActiveNarrative(state)
    },
    app: {
      selected: state.app.selected,
      language: state.app.language,
      timeline: state.app.timeline,
      narrative: state.app.narrative
    },
    ui: {
      dom: state.ui.dom,
      styles: state.ui.style.selectedEvents
    }
  }
}

export default connect(mapStateToProps)(Timeline)