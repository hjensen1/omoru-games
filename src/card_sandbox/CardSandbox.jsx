import { useEffect } from "react"
import CardRenderer from "../card_game/CardRenderer"
import PlayingCard from "../card_game/PlayingCard"
import { doInitCardSandbox } from "./cauldron/cardSandboxActions"
import { doArrangeCards } from "../card_game/arrangeCards"

export default function CardSandbox() {
  useEffect(() => {
    setTimeout(() => {
      doInitCardSandbox()
      // doArrangeCards()
    }, 1000)
  }, [])
  return <CardRenderer CardComponent={PlayingCard} />
}
