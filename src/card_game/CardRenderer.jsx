import { useSelector } from "react-redux"

export default function CardRenderer({ CardComponent }) {
  const cardsDisplay = Object.values(useSelector((state) => state.cardsDisplay))

  return cardsDisplay.map((cardDisplay) => <CardComponent key={cardDisplay.id} cardDisplay={cardDisplay} />)
}
