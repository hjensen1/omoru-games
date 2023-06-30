import { useEffect } from "react"
import { useCardPositions } from "./CardRenderer"
import { useCardSize } from "./CardSizeContext"

export default function CardInteraction({
  card,
  onClick,
  containerTop,
  containerLeft,
  top,
  left,
  revealed = true,
  visible = true,
  zIndex = 0,
}) {
  const { cardWidth, cardHeight } = useCardSize()
  const { position, setPosition } = useCardPositions()[card.id]
  top += containerTop
  left += containerLeft

  useEffect(() => {
    if (
      top !== position.top ||
      left !== position.left ||
      revealed !== position.revealed ||
      visible !== position.visible ||
      zIndex !== position.zIndex
    ) {
      setPosition({ top, left, revealed, visible, zIndex })
    }
  }, [
    top,
    left,
    revealed,
    visible,
    zIndex,
    position.top,
    position.left,
    position.revealed,
    position.visible,
    position.zIndex,
  ])

  if (!visible) return null

  return (
    <div
      className="absolute cursor-pointer"
      style={{ top: top - containerTop, left: left - containerLeft, width: cardWidth, height: cardHeight }}
      onClick={() => onClick && onClick(card)}
    />
  )
}
