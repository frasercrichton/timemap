import React from 'react'
import colors from '../../../common/global'

const TimelineMarkers = ({
  styles,
  eventRadius,
  getEventX,
  getEventY,
  getDatetimeX, 
  transitionDuration,
  selected,
  dims,
  features
}) => {
  function renderMarker (event) {
    function renderCircle () {
      return <circle
        className='timeline-marker'
        cx={0}
        cy={0}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 1}
        stroke-linejoin='round'
        stroke-dasharray={styles ? styles['stroke-dasharray'] : '2,2'}
        style={{
          'transform': `translate(${getEventX(event)}px, ${getEventY(event)}px)`,
          '-webkit-transition': `transform ${transitionDuration / 1000}s ease`,
          '-moz-transition': 'none',
          'opacity': 0.9
        }}
        r={eventRadius * 2}
      />
    }
    function renderBar () {
      let width
      if (event.time_type === 'duration') {
        event.shape = 'bar'
        const eventStartTime = getDatetimeX(event.start_datetime)
        const eventEndTime = getDatetimeX(event.end_datetime)
        width = eventEndTime - eventStartTime
      }
      const barWidth = (width) ? width : eventRadius / 2
      const y = (width) ? getEventY(event) + (dims.marginTop * 2) - 1 : dims.marginTop
     // dims.contentHeight - 55
      
      return <rect
        className='timeline-marker'
        x={0}
        y={getEventY(event)}
        width={barWidth}
        height={112}
        stroke={styles ? styles.stroke : colors.primaryHighlight}
        stroke-opacity='1'
        stroke-width={styles ? styles['stroke-width'] : 4}
        stroke-dasharray={styles ? styles['stroke-dasharray'] : '2,2'}
        style={{
          'transform': `translate(${getEventX(event)}px)`,
          'opacity': 0.7
        }}
      />
    }
    const isDot = (!!event.location && !!event.longitude) || (features.GRAPH_NONLOCATED && event.projectOffset !== -1)

    switch (event.shape) {
      case 'circle':
        return renderCircle()
      case 'bar':
        return renderBar()
      case 'diamond':
        return renderCircle()
      case 'star':
        return renderCircle()
      default:
        return isDot ? renderCircle() : renderBar()
    }
  }

  return (
    <g
      clipPath={'url(#clip)'}
    >
      {selected.map(event => renderMarker(event))}
    </g>
  )
}

export default TimelineMarkers
