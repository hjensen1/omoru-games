import { useSelector } from "react-redux"
import { CardClickContext, CardZonesContext } from "./cardContexts"
import { useMemo, useRef } from "react"
import { debounce } from "lodash"
import { doAutoResizeZones } from "./genericCardActions"

export default function CardRenderer({ CardComponent, onCardClick, children }) {
  const cardsDisplay = Object.values(useSelector((state) => state.cardsDisplay))

  const clickContextValue = useMemo(() => ({ onCardClick }), [onCardClick])

  const cardZonesRef = useRef({})
  const cardZonesContextValue = useMemo(() => {
    const debouncedResize = debounce(doAutoResizeZones, 100)
    return {
      onZoneResized: (zoneDisplay) => {
        cardZonesRef.current[zoneDisplay.id] = zoneDisplay
        debouncedResize(cardZonesRef.current)
      },
    }
  }, [])

  return (
    <CardClickContext.Provider value={clickContextValue}>
      <CardZonesContext.Provider value={cardZonesContextValue}>
        {children}
        {cardsDisplay.map((cardDisplay) => (
          <CardComponent key={cardDisplay.id} cardDisplay={cardDisplay} />
        ))}
      </CardZonesContext.Provider>
    </CardClickContext.Provider>
  )
}
