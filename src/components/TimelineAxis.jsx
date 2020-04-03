import React from 'react'
import * as d3 from 'd3'

class TimelineAxis extends React.Component {
  constructor () {
    super()
    this.xAxis0Ref = React.createRef()
    this.xAxis1Ref = React.createRef()
    this.state = {
      isInitialized: false
    }
  }

  componentDidUpdate () {
    if (this.props.scaleX) {
      this.x0 =
        d3.axisBottom(this.props.scaleX)
          .ticks(10)
          .tickPadding(5)
          .tickSize(this.props.dims.trackHeight)
          .tickFormat(d3.timeFormat('%Y'))

      this.x1 =
        d3.axisBottom(this.props.scaleX)
          .ticks(10)
          .tickPadding(this.props.dims.margin_top)
          .tickSize(0)
          .tickFormat(d3.timeFormat('%b'))

      if (!this.state.isInitialized) this.setState({ isInitialized: true })
    }

    if (this.state.isInitialized) {
      d3.select(this.xAxis0Ref.current)
        .transition()
        .duration(this.props.transitionDuration)
        .call(this.x0)

      d3.select(this.xAxis1Ref.current)
        .transition()
        .duration(this.props.transitionDuration)
        .call(this.x1)
    }
  }

  render () {
    return (
      <React.Fragment>
        <g
          ref={this.xAxis0Ref}
          transform={`translate(0, 25)`}
          clipPath={`url(#clip)`}
          className={`axis xAxis`}
        />
        {<g
          ref={this.xAxis1Ref}
          transform={`translate(0, 105)`}
          clipPath={`url(#clip)`}
          className={`axis axisHourText`}
        />}
      </React.Fragment>
    )
  }
}

export default TimelineAxis
