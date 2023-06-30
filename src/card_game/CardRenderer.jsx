import { useRef } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"

export function CardRenderer({ CardComponent, children }) {
  const cards = useSelector((state) => state.cards)
  const controlRef = useRef({})
  return (
    <>
      <CardPositionContext.Provider value={controlRef.current}>{children}</CardPositionContext.Provider>
      {cards.map((card) => (
        <CardWrapper key={card.id} card={card} CardComponent={CardComponent} controlRef={controlRef} />
      ))}
    </>
  )
}

// Use a ref to allow other components to control this component's position
function CardWrapper({ card, CardComponent, controlRef }) {
  const [position, setPosition] = useState({ top: 0, left: 0, revealed: true, visible: false })

  useEffect(() => {
    controlRef.current[card.id] = { position, setPosition }
    return () => {
      delete controlRef.current[card.id]
    }
  }, [position, setPosition])

  return <CardComponent card={card} {...position} />
}

const CardPositionContext = createContext(null)

export function useCardPositions() {
  return useContext(CardPositionContext)
}
