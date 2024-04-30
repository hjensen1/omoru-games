import { useSelector } from "react-redux"
import { peerId } from "../peerjsMiddleware/peerId"
import Hand from "../card_game/Hand"
import { useCardSize } from "../card_game/CardSizeContext"
import clsx from "clsx"

export default function PlayerZones({ seatIndex, relativeSeatIndex }) {
  const { cardWidth, cardHeight } = useCardSize()
  const seats = useSelector((state) => state.seats)

  const playerId = seats[seatIndex]
  if (!playerId) return null

  let rotation = ""
  if (relativeSeatIndex === 1) {
    rotation = "rotate-90"
  } else if (relativeSeatIndex === 2) {
    rotation = "rotate-180"
  } else if (relativeSeatIndex === 3) {
    rotation = "-rotate-90"
  }

  return (
    <div className={clsx("origin-top absolute top-1/2 left-64 pt-64", rotation)}>
      <div className={clsx("flex flex-col justify-center space-y-8 border border-gray-500")}>
        <div className="text-20">Player {seatIndex + 1}</div>
        <Hand width={cardWidth * 3} height={cardHeight} zoneId={`discard-${playerId}`} />
        <Hand width={cardWidth * 2} height={cardHeight} zoneId={`hand-${playerId}`} />
      </div>
    </div>
  )
}
