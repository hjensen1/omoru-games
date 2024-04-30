import { useSelector } from "react-redux"
import { ZoneContext } from "./ZoneContext"
import { useCardSize } from "./CardSizeContext"
import CardInteraction from "./CardInteraction"
import { useState } from "react"
import { useZoneCards } from "../card_sandbox/cauldron/cardActions"

export default function Deck({ zoneId, onClick }) {
  const { cardWidth, cardHeight } = useCardSize()
  const zone = useSelector((state) => state.zones[zoneId])
  const cards = useZoneCards(zoneId)
  const { revealed } = zone

  const [containerEl, setContainerEl] = useState(null)
  const { top, left } = containerEl?.getBoundingClientRect() || {}

  return (
    <ZoneContext.Provider value={zone}>
      <div className="relative cursor-pointer" style={{ width: cardWidth, height: cardHeight }} ref={setContainerEl}>
        {containerEl &&
          cards.map((card, index) => (
            <CardInteraction
              key={card.id}
              card={card}
              containerTop={top + window.scrollY}
              containerLeft={left + window.scrollX}
              top={0}
              left={0}
              revealed={revealed}
              onClick={onClick}
              visible={index === 0}
            />
          ))}
      </div>
    </ZoneContext.Provider>
  )
}
