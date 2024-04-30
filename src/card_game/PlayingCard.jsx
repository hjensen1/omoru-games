import Card from "./Card"
import cardImages from "./playingCardImages"

export default function PlayingCard({ cardDisplay }) {
  return <Card Front={cardImages[cardDisplay.face]} Back={cardImages[cardDisplay.back]} cardDisplay={cardDisplay} />
}
