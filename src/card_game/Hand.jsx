import { useSelector } from "react-redux"
import { peerId } from "../peerjsMiddleware/peerId"
import { ZoneContext } from "./ZoneContext"
import { useCardSize } from "./CardSizeContext"
import CardInteraction from "./CardInteraction"
import { useState } from "react"

export default function Hand({ width, height, zoneId, onClick }) {
  const { cardWidth, cardHeight } = useCardSize()
  const zone = useSelector((state) => state.zones[zoneId])
  const { cards, owner } = zone
  const revealed = !owner || owner === peerId

  const [containerEl, setContainerEl] = useState(null)
  const { top, left } = containerEl?.getBoundingClientRect() || {}

  return (
    <ZoneContext.Provider value={zone}>
      <div className="relative" style={{ width, height }} ref={setContainerEl}>
        {containerEl &&
          cards.map((card, index) => (
            <CardInteraction
              key={card.id}
              card={card}
              containerTop={top + window.scrollY}
              containerLeft={left + window.scrollX}
              top={0}
              left={
                cardWidth * cards.length > width
                  ? (width - cardWidth) * (index / (cards.length - 1))
                  : (width - cardWidth * cards.length) / 2 + index * cardWidth
              }
              revealed={revealed}
              visible={true}
              zIndex={index}
              onClick={onClick}
            />
          ))}
      </div>
    </ZoneContext.Provider>
  )
}
