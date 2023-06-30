import { useContext } from "react"
import { createContext } from "react"
import { peerId } from "../peerjsMiddleware/peerId"

export const ZoneContext = createContext(null)

export function useZone() {
  return useContext(ZoneContext)
}

export function useCardsRevealed() {
  const { owner } = useZone()
  return !owner || owner === peerId
}
