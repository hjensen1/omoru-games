import { every } from "lodash"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { endRound } from "./gameSetup"

export default function TurnEnder() {
  const isTurnOver = useSelector((state) => {
    const rounds = [state.rounds[0].last, state.rounds[1].last]
    if (!rounds[0]) return false
    return every(rounds, (round) => round.cluesSubmitted && round.theirsSubmitted && round.oursSubmitted)
  })

  useEffect(() => {
    if (isTurnOver) endRound()
  }, [isTurnOver])

  return null
}
