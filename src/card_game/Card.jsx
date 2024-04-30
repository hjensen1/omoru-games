import { useEffect, useState } from "react"
import { cardClicked } from "../card_sandbox/cauldron/cardSandboxActions"

export default function Card({ Front, Back, cardDisplay }) {
  const { top, left, width, height, rotation, zIndex, view, visible } = cardDisplay
  const Face = view === "face-down" ? Back : Front
  const transform = rotation % 360 === 0 ? undefined : `rotate(${rotation % 360}deg)`

  const [hovering, setHovering] = useState(false)

  return (
    <div
      className="absolute transition-all cursor-pointer"
      style={{ top, left, zIndex }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => cardClicked(cardDisplay.id)}
    >
      {visible && <Face style={{ width, height, transform }} />}
    </div>
  )
}
