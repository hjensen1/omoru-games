import { useSelector } from "react-redux"
import Hand from "../card_game/Hand"
import { CardSizeContext } from "../card_game/CardSizeContext"
import { CardRenderer } from "../card_game/CardRenderer"
import PlayingCard from "../card_game/PlayingCard"
import { doSendCard } from "./cauldron/cardActions"
import Deck from "../card_game/Deck"

const CARD_SIZE = {
  cardWidth: 250,
  cardHeight: 350,
  baseCardWidth: 250,
  baseCardHeight: 350,
  scale: 1,
}

export default function CardSandbox() {
  const zones = useSelector((state) => state.zones)
  return (
    <CardSizeContext.Provider value={CARD_SIZE}>
      <div className="flex-center flex-col min-h-screen text-gray-300 text-14">
        <div className="mb-4">This is CardSandbox</div>
        <CardRenderer CardComponent={PlayingCard}>
          {Object.values(zones).map((zone) =>
            zone.type === "deck" ? (
              <div key={zone.id} className="border-2 border-gray-500 p-2 mb-4">
                <Deck
                  zoneId={zone.id}
                  onClick={(card) =>
                    doSendCard({
                      cardId: card.id,
                      fromZoneId: zone.id,
                      toZoneId: "zone1",
                    })
                  }
                />
              </div>
            ) : (
              <div key={zone.id} className="border-2 border-gray-500 p-2 mb-4">
                <Hand
                  zoneId={zone.id}
                  width={1000}
                  height={350}
                  onClick={(card) =>
                    doSendCard({
                      cardId: card.id,
                      fromZoneId: zone.id,
                      toZoneId: zone.id === "zone1" ? "zone2" : "zone1",
                    })
                  }
                />
              </div>
            )
          )}
        </CardRenderer>
      </div>
    </CardSizeContext.Provider>
  )
}
