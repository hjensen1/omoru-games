import { useSelector } from "react-redux"
import Hand from "../card_game/Hand"
import { CardSizeContext } from "../card_game/CardSizeContext"
import { CardRenderer } from "../card_game/CardRenderer"
import PlayingCard from "../card_game/PlayingCard"

import { peerId } from "../peerjsMiddleware/peerId"
import PlayerZones from "./PlayerZones"
import { useEffect } from "react"
import { doInitTestGame } from "./cauldron/cardActions"
import LoveLetterCard from "./LoveLetterCard"

const CARD_SIZE = {
  cardWidth: 125,
  cardHeight: 175,
  baseCardWidth: 250,
  baseCardHeight: 350,
  scale: 0.5,
}

export default function LoveLetter() {
  const seats = useSelector((state) => state.seats)
  const mySeatIndex = seats.indexOf(peerId)

  useEffect(() => {
    setTimeout(doInitTestGame, 1000)
  }, [])

  return (
    <CardSizeContext.Provider value={CARD_SIZE}>
      <div className="flex-center flex-col min-h-screen text-gray-300 text-14">
        <div className="mb-4">This is LoveLetter</div>
        <CardRenderer CardComponent={LoveLetterCard}>
          {[0, 1, 2, 3].map((relativeSeatIndex) => {
            const seatIndex = (relativeSeatIndex + mySeatIndex) % 4
            return <PlayerZones key={relativeSeatIndex} seatIndex={seatIndex} relativeSeatIndex={relativeSeatIndex} />
          })}
          {/* {Object.values(zones).map((zone) =>
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
          )} */}
        </CardRenderer>
      </div>
    </CardSizeContext.Provider>
  )
}
