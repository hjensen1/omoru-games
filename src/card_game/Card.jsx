import { useState } from "react"
import { useCardClickContext } from "./cardContexts"
import clsx from "clsx"

export default function Card({ Front, Back, cardDisplay }) {
  const { onCardClick } = useCardClickContext()
  const { top, left, width, height, rotation, zIndex, view, visible } = cardDisplay
  const Face = view === "face-down" ? Back : Front
  const transform = rotation % 360 === 0 ? undefined : `rotate(${rotation % 360}deg)`

  const [hovering, setHovering] = useState(false)

  return (
    <>
      <div
        className={clsx(
          "absolute transition-all select-none -m-1 border-4 rounded-2xl",
          hovering ? "border-blue-200" : "border-transparent"
        )}
        style={{ top, left, zIndex: hovering ? 5000 : zIndex, transitionProperty: "left, top, transform" }}
      >
        {visible && <Face style={{ width, height, transform }} />}
      </div>
      {/* Invisible hover target to improve behavior when hovering over occluded cards */}
      <div
        className={clsx("absolute transition-all cursor-pointer")}
        style={{ top, left, zIndex: zIndex + 10000, transitionProperty: "left, top, transform" }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => onCardClick(cardDisplay.id)}
      >
        {visible && <div style={{ width, height, transform }} />}
      </div>
    </>
  )
}
