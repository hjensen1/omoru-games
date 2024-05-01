import { useSelector } from "react-redux"
import { CardClickContext, CardZonesContext } from "./cardContexts"
import { useMemo, useRef } from "react"
import { debounce } from "lodash"
import { doAutoResizeZones } from "./genericCardActions"
import useResizeObserver from "use-resize-observer"

export default function CardRenderer({ CardComponent, onCardClick, children }) {
  const cardsDisplay = Object.values(useSelector((state) => state.cardsDisplay))

  const clickContextValue = useMemo(() => ({ onCardClick }), [onCardClick])

  const { ref: resizeRef, width, height } = useResizeObserver()
  const cardZonesRef = useRef({})
  const cardZonesContextValue = useMemo(() => {
    const debouncedResize = debounce(doAutoResizeZones, 100)
    return {
      onZoneResized: (zoneDisplay) => {
        cardZonesRef.current[zoneDisplay.id] = zoneDisplay
        debouncedResize(cardZonesRef.current)
      },
      width, // triggers zone resize when window is resized
      height,
    }
  }, [width, height])

  return (
    <CardClickContext.Provider value={clickContextValue}>
      <CardZonesContext.Provider value={cardZonesContextValue}>
        <div className="fixed w-full h-full pointer-events-none -z-100" ref={resizeRef} />
        {children}
        {cardsDisplay.map((cardDisplay) => (
          <CardComponent key={cardDisplay.id} cardDisplay={cardDisplay} />
        ))}
      </CardZonesContext.Provider>
    </CardClickContext.Provider>
  )
}
