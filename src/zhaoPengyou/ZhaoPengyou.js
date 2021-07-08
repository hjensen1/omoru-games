import { useDispatch, useSelector } from "react-redux"
import cards from "./cards"

export default function ZhaoPengyou() {
  return (
    <div className="flex overflow-x-auto w-full">
      <div className="flex">
        {Object.values(cards).map((Card) => (
          <Card className="mr-2" style={{ width: 200, height: 290 }} />
        ))}
      </div>
    </div>
  )
}
