import Guard from "../card_game/images/ace_of_clubs.svg?component"
import Priest from "../card_game/images/2_of_clubs.svg?component"
import Baron from "../card_game/images/3_of_spades.svg?component"
import Handmaid from "../card_game/images/4_of_spades.svg?component"
import Prince from "../card_game/images/5_of_diamonds.svg?component"
import King from "../card_game/images/6_of_diamonds.svg?component"
import Countess from "../card_game/images/7_of_hearts.svg?component"
import Princess from "../card_game/images/8_of_hearts.svg?component"
import Back2 from "../card_game/images/card_back_2.svg?component"
import Card from "../card_game/Card"

const allCards = {
  Guard,
  Priest,
  Baron,
  Handmaid,
  Prince,
  King,
  Countess,
  Princess,
  Back2,
}

export default function LoveLetterCard({ card, ...props }) {
  return <Card Front={allCards[card.name]} Back={allCards.Back2} {...props} />
}
