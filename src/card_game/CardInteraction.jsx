import { useEffect } from "react"
import { useCardPositions } from "./CardRenderer"
import { useCardSize } from "./CardSizeContext"
import { useState } from "react"

export default function CardInteraction({
  card,
  onClick,
  onMouseEnter = undefined,
  onMouseLeave = undefined,
  containerTop,
  containerLeft,
  top,
  left,
  revealed = true,
  visible = true,
  zIndex = 0,
  occluded = false,
}) {
  const { cardWidth, cardHeight } = useCardSize()
  const { position, setPosition } = useCardPositions()[card.id]
  top += containerTop
  left += containerLeft

  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (
      top !== position.top ||
      left !== position.left ||
      revealed !== position.revealed ||
      visible !== position.visible ||
      zIndex !== position.zIndex ||
      hovering !== position.hovering
    ) {
      setPosition({ top, left, revealed, visible, zIndex, hovering })
    }
  }, [
    top,
    left,
    revealed,
    visible,
    zIndex,
    hovering,
    position.top,
    position.left,
    position.revealed,
    position.visible,
    position.zIndex,
    position.hovering,
  ])

  if (!visible) return null

  return (
    <div
      className="absolute cursor-pointer"
      style={{ top: top - containerTop, left: left - containerLeft, width: cardWidth, height: cardHeight }}
      onClick={() => onClick && onClick(card)}
      onMouseEnter={onMouseEnter || (() => setHovering(true))}
      onMouseLeave={onMouseLeave || (() => setHovering(false))}
    />
  )
}
