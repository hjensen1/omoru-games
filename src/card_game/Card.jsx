import { useCardSize } from "./CardSizeContext"

export default function Card({ Front, Back, top, left, revealed, visible, zIndex }) {
  const { cardWidth, cardHeight } = useCardSize()
  const Face = revealed ? Front : Back
  return (
    <div className="absolute transition-all pointer-events-none" style={{ top, left, zIndex }}>
      {visible && <Face style={{ width: cardWidth, height: cardHeight }} />}
    </div>
  )
}
