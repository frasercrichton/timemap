location = / {
      return 301 /curfew-bell/;
 }


Reemeber to plus +1 teh day as ot goes overnight



    return d3.scaleTime()
      .domain(this.state.timerange)
      .range([this.state.dims.marginLeft, this.state.dims.width - this.state.dims.width_controls])



<rect class="event" x="765.0000074374415" y="0" style="fill: rgb(120, 247, 103); fill-opacity: 0.3; transition: transform 0.3s ease 0s;" width="2" height="150"></rect>

width="2" height="150"
=


 .attr("x", getXPos)
            .attr("y", getStackPosition)
            .attr("width", function (d, i) {
              return (d.ending_time - d.starting_time) * scaleFactor;
            })
            .attr("cy", function(d, i) {
                return getStackPosition(d, i) + itemHeight/2;
            })
          

          

   width={props.eventRadius / 4}
    height={props.dims.trackHeight}
 

function renderBar (event, styles, props) {
  const fillOpacity = props.features.GRAPH_NONLOCATED
    ? event.projectOffset >= 0 ? styles.opacity : 0.5
    : calcOpacity(1)

  return <DatetimeBar
    onSelect={props.onSelect}
    category={event.category}
    events={[event]}
    x={props.x}
    y={props.dims.marginTop}
    width={props.eventRadius / 4}
    height={props.dims.trackHeight}
    styleProps={{ ...styles, fillOpacity }}
    highlights={props.highlights}
  />
}

xprops.x


  getDatetimeX (datetime) {
    return this.state.scaleX(datetime)
  }

  getY (event) {
    const { features, domain } = this.props
    const { USE_CATEGORIES, GRAPH_NONLOCATED } = features

    if (!USE_CATEGORIES) { return this.state.dims.trackHeight / 2 }

    const { category, project } = event
    if (GRAPH_NONLOCATED && GRAPH_NONLOCATED.categories.includes(category)) {
      return this.state.dims.marginTop + domain.projects[project].offset + this.props.ui.eventRadius
    }
    return this.state.scaleY(category)
  }

