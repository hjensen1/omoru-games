import { useSelector } from "react-redux"
import { hostId } from "../peerjsMiddleware/hostId"
import { peerId } from "../peerjsMiddleware/peerId"
import GameBoard from "./GameBoard"
import { startGame } from "./gameSetup"
import TurnEnder from "./TurnEnder"
import JoinGame from "./JoinGame"
import { useMediaQuery } from "react-responsive"
import MobileGameBoard, { MobileGame } from "./MobileGameBoard"

export default function Decrypto() {
  const players = useSelector((state) => state.players)
  const self = players.find((p) => p.id === peerId)
  const canStartGame = useSelector(
    (state) => state.rounds[0].length === 0 && state.teams[0].length >= 1 && state.teams[1].length >= 1
  )
  const isMobile = useMediaQuery({ maxWidth: 1200 })

  if (!self) {
    return <JoinGame />
  }
  // if (self.team == null) {
  //   return <JoinTeam />
  // }
  return isMobile ? (
    <MobileGame self={self} startGame={startGame} canStartGame={canStartGame} />
  ) : (
    <div className="flex flex-col items-center justify-center p-8 pt-4 space-y-4">
      <div className="text-gray-300 text-24 font-bold">Game ID: {hostId}</div>
      {hostId === peerId && canStartGame && (
        <button className="btn flex-0 w-32" onClick={startGame}>
          Start Game
        </button>
      )}
      <div className="flex justify-center space-x-8">
        <GameBoard team={0} self={self} />
        <GameBoard team={1} self={self} />
      </div>
      <TurnEnder />
    </div>
  )
}
