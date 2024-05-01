import { useCardZonesContext } from "./cardContexts"
import { memo, useEffect, useRef, useState } from "react"
import { eq } from "lodash"

function Zone({ id, className, style, children, ...props }) {
  const { onZoneResized } = useCardZonesContext()
  const [el, setEl] = useState()

  const prevDimensions = useRef({})
  useEffect(() => {
    if (!el) return
    const dimensions = {
      id,
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.clientWidth,
      height: el.clientHeight,
    }
    if (!eq(dimensions, prevDimensions.current)) {
      onZoneResized(dimensions)
      prevDimensions.current = dimensions
    }
  })

  return (
    <div className={className} style={style} {...props} ref={setEl} id="test1">
      {children}
    </div>
  )
}

export default memo(Zone)
