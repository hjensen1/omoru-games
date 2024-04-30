import { useCardSize } from "./CardSizeContext"

export default function Card({ Front, Back, top, left, revealed, visible, zIndex, hovering }) {
  const { cardWidth, cardHeight } = useCardSize()
  const Face = revealed ? Front : Back
  if (hovering) zIndex = 9999
  return (
    <div className="absolute transition-all pointer-events-none" style={{ top, left, zIndex }}>
      {visible && <Face style={{ width: cardWidth, height: cardHeight }} />}
    </div>
  )
}
