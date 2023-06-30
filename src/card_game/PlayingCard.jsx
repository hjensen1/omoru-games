import Card from "./Card"
import cardImages from "./playingCardImages"

export default function PlayingCard({ card, ...props }) {
  return <Card Front={cardImages[card.face]} Back={cardImages.Back2} {...props} />
}
