import C2 from "./images/2_of_clubs.svg?component"
import C3 from "./images/3_of_clubs.svg?component"
import C4 from "./images/4_of_clubs.svg?component"
import C5 from "./images/5_of_clubs.svg?component"
import C6 from "./images/6_of_clubs.svg?component"
import C7 from "./images/7_of_clubs.svg?component"
import C8 from "./images/8_of_clubs.svg?component"
import C9 from "./images/9_of_clubs.svg?component"
import C0 from "./images/10_of_clubs.svg?component"
import CJ from "./images/jack_of_clubs.svg?component"
import CQ from "./images/queen_of_clubs.svg?component"
import CK from "./images/king_of_clubs.svg?component"
import CA from "./images/ace_of_clubs.svg?component"
import D2 from "./images/2_of_diamonds.svg?component"
import D3 from "./images/3_of_diamonds.svg?component"
import D4 from "./images/4_of_diamonds.svg?component"
import D5 from "./images/5_of_diamonds.svg?component"
import D6 from "./images/6_of_diamonds.svg?component"
import D7 from "./images/7_of_diamonds.svg?component"
import D8 from "./images/8_of_diamonds.svg?component"
import D9 from "./images/9_of_diamonds.svg?component"
import D0 from "./images/10_of_diamonds.svg?component"
import DJ from "./images/jack_of_diamonds.svg?component"
import DQ from "./images/queen_of_diamonds.svg?component"
import DK from "./images/king_of_diamonds.svg?component"
import DA from "./images/ace_of_diamonds.svg?component"
import H2 from "./images/2_of_hearts.svg?component"
import H3 from "./images/3_of_hearts.svg?component"
import H4 from "./images/4_of_hearts.svg?component"
import H5 from "./images/5_of_hearts.svg?component"
import H6 from "./images/6_of_hearts.svg?component"
import H7 from "./images/7_of_hearts.svg?component"
import H8 from "./images/8_of_hearts.svg?component"
import H9 from "./images/9_of_hearts.svg?component"
import H0 from "./images/10_of_hearts.svg?component"
import HJ from "./images/jack_of_hearts.svg?component"
import HQ from "./images/queen_of_hearts.svg?component"
import HK from "./images/king_of_hearts.svg?component"
import HA from "./images/ace_of_hearts.svg?component"
import S2 from "./images/2_of_spades.svg?component"
import S3 from "./images/3_of_spades.svg?component"
import S4 from "./images/4_of_spades.svg?component"
import S5 from "./images/5_of_spades.svg?component"
import S6 from "./images/6_of_spades.svg?component"
import S7 from "./images/7_of_spades.svg?component"
import S8 from "./images/8_of_spades.svg?component"
import S9 from "./images/9_of_spades.svg?component"
import S0 from "./images/10_of_spades.svg?component"
import SJ from "./images/jack_of_spades.svg?component"
import SQ from "./images/queen_of_spades.svg?component"
import SK from "./images/king_of_spades.svg?component"
import SA from "./images/ace_of_spades.svg?component"
import BX from "./images/black_joker.svg?component"
import RX from "./images/red_joker.svg?component"
import Back1 from "./images/card_back_1.svg?component"
import Back2 from "./images/card_back_2.svg?component"

const allCards = {
  C2,
  C3,
  C4,
  C5,
  C6,
  C7,
  C8,
  C9,
  C0,
  CJ,
  CQ,
  CK,
  CA,
  D2,
  D3,
  D4,
  D5,
  D6,
  D7,
  D8,
  D9,
  D0,
  DJ,
  DQ,
  DK,
  DA,
  H2,
  H3,
  H4,
  H5,
  H6,
  H7,
  H8,
  H9,
  H0,
  HJ,
  HQ,
  HK,
  HA,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S0,
  SJ,
  SQ,
  SK,
  SA,
  BX,
  RX,
  Back1,
  Back2,
}

export default allCards

export function buildPlayingCardDisplay({ id, face = id, back = "Back1" }) {
  return {
    id,
    face,
    back,
    rotation: 0,
    zIndex: 0,
    view: "face-up",
    visible: true,
  }
}

export function buildPlayingCardDeck({ includeJokers = true, back = "Back1", buildCardId = (x) => x } = {}) {
  const map = {
    C2,
    C3,
    C4,
    C5,
    C6,
    C7,
    C8,
    C9,
    C0,
    CJ,
    CQ,
    CK,
    CA,
    D2,
    D3,
    D4,
    D5,
    D6,
    D7,
    D8,
    D9,
    D0,
    DJ,
    DQ,
    DK,
    DA,
    H2,
    H3,
    H4,
    H5,
    H6,
    H7,
    H8,
    H9,
    H0,
    HJ,
    HQ,
    HK,
    HA,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S0,
    SJ,
    SQ,
    SK,
    SA,
  }
  if (includeJokers) {
    map.BX = BX
    map.RX = RX
  }

  return Object.keys(map).map((face) => buildPlayingCardDisplay({ id: buildCardId(face), face, back }))
}
