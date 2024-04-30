import { useSelector } from "react-redux"
import { CardClickContext } from "./cardContexts"
import { useMemo } from "react"

export default function CardRenderer({ CardComponent, onCardClick, children }) {
  const cardsDisplay = Object.values(useSelector((state) => state.cardsDisplay))

  const clickContextValue = useMemo(() => ({ onCardClick }), [onCardClick])

  return (
    <CardClickContext.Provider value={clickContextValue}>
      {children}
      {cardsDisplay.map((cardDisplay) => (
        <CardComponent key={cardDisplay.id} cardDisplay={cardDisplay} />
      ))}
    </CardClickContext.Provider>
  )
}
