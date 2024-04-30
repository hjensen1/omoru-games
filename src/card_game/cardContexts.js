import { createContext, useContext } from "react"

export const CardClickContext = createContext({})
export function useCardClickContext() {
  return useContext(CardClickContext)
}

export const CardZonesContext = createContext({})
export function useCardZonesContext() {
  return useContext(CardZonesContext)
}
