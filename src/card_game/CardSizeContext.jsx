import { useContext } from "react"
import { createContext } from "react"

export const CardSizeContext = createContext({
  cardWidth: 250,
  cardHeight: 350,
  baseCardWidth: 250,
  baseCardHeight: 350,
  scale: 1,
})

export function useCardSize() {
  return useContext(CardSizeContext)
}
