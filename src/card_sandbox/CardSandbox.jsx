import { useEffect } from "react"
import CardRenderer from "../card_game/CardRenderer"
import PlayingCard from "../card_game/PlayingCard"
import { doInitCardSandbox, sandboxCardClicked } from "./cauldron/cardSandboxActions"
import { doArrangeCards } from "../card_game/arrangeCards"
import Zone from "../card_game/Zone"
import { useSelector } from "react-redux"

export default function CardSandbox() {
  useEffect(() => {
    setTimeout(() => {
      doInitCardSandbox()
      // doArrangeCards()
    }, 1000)
  }, [])

  const zones = useSelector((state) => state.zones)

  return (
    <CardRenderer CardComponent={PlayingCard} onCardClick={sandboxCardClicked}>
      {Object.values(zones).length > 0 && (
        <div className="p-8">
          <div className="flex space-x-4">
            <div className="border-4 border-gray-500 rounded-2xl p-2 flex-1">
              <Zone id="zone1" style={{ height: 350 }} />
            </div>

            <div className="border-4 border-gray-500 rounded-2xl p-2">
              <Zone id="deck1" style={{ width: 250, height: 350 }} />
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <div className="border-4 border-gray-500 rounded-2xl p-2 flex-1">
              <Zone id="zone2" style={{ height: 300 }} />
            </div>

            <div className="border-4 border-gray-500 rounded-2xl p-2">
              <div style={{ width: 250, height: 300 }} />
            </div>
          </div>
        </div>
      )}
    </CardRenderer>
  )
}
