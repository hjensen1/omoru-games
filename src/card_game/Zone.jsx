import useResizeObserver from "use-resize-observer"
import { useCardZonesContext } from "./cardContexts"
import { useEffect, useRef, useState } from "react"
import mergeRefs from "merge-refs"
import { eq } from "lodash"

export default function Zone({ id, className, style, children, ...props }) {
  const { onZoneResized } = useCardZonesContext()
  // useResizeObserver doesn't really give me all the information I want.
  // For now it's just here as an extra way to trigger re-render, and I check dimensions on EVERY render.
  const { ref: resizeRef } = useResizeObserver()
  const [el, setEl] = useState()
  const ref = mergeRefs(resizeRef, setEl)

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
    <div className={className} style={style} {...props} ref={ref} id="test1">
      {children}
    </div>
  )
}
