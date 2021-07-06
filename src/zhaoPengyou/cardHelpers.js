import shuffle from "lodash/shuffle"
import sortBy from "lodash/sortBy"
import countBy from "lodash/countBy"

const suitOrder = {
  H: 100,
  C: 200,
  D: 300,
  S: 400,
}

const rankOrder = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  0: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
}

const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"]
const suits = ["C", "D", "H", "S"]

export function buildDeck(deckCount = 2) {
  const deck = []

  for (const rank of ranks) {
    for (const suit of suits) {
      for (let i = 0; i < deckCount; i++) {
        deck.push(suit + rank)
      }
    }
  }
  for (let i = 0; i < deckCount; i++) {
    deck.push("LX")
    deck.push("BX")
  }

  return shuffle(deck)
}

export function sortHand(cards, { cardOrder }) {
  return cards.sort((a, b) => {
    const diff = cardOrder[a] - cardOrder[b]
    if (diff !== 0) return diff
    return a < b ? -1 : 1
  })
}

export function isTrump([suit, rank], trump) {
  const { trumpSuit, trumpRank } = trump
  return suit === trumpSuit || rank === trumpRank || rank === "X"
}

export function getSuit(card, trump) {
  return isTrump(card, trump) ? "T" : card[0]
}

export function buildCardOrder(trump) {
  const { trumpSuit, trumpRank } = trump
  const order = {}

  let suitIndex = 100
  for (const suit of suits) {
    let rankIndex = 3
    for (const rank of ranks) {
      if (rank === trumpRank) continue
      const suitValue = suit === trumpSuit ? 1000 : suitIndex
      order[suit + rank] = suitValue + rankIndex
      rankIndex++
    }
    suitIndex += 100
  }
  const maxOrder = Math.max(...Object.values(order))
  suits.forEach((suit) => (order[suit + trumpRank] = maxOrder + 1))
  order[trumpSuit + trumpRank] = maxOrder + 2
  order["LX"] = maxOrder + 3
  order["BX"] = maxOrder + 4
  return order
}

export function getHandShape(cards, trump, leadSuit) {
  if (isTrash(cards, trump, leadSuit)) return "trash"
  cards = sortHand(cards, trump)

  const counts = countBy(cards)
  const baseShape = {}
  Object.entries(counts).forEach(([card, count]) => (baseShape[count] ??= []).push(card))

  let shape = []
  for (let count in baseShape) {
    count = parseInt(count)
    if (count === 1) {
      baseShape[1].forEach((card) => shape.push([1, 1, card]))
      continue
    }

    const sets = baseShape[count]
    let tractor = []
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i]
      if (tractor.length && trump.cardOrder[set] === trump.cardOrder[tractor.last] + 1) {
        tractor.push(set)
      } else if (tractor.length > 1) {
        shape.push([count, tractor.length, tractor.last])
        tractor = [set]
      } else if (tractor.length === 1) {
        shape.push([count, 1, tractor.last])
        tractor = [set]
      } else {
        tractor = [set]
      }
    }
    if (tractor.length > 1) {
      shape.push([count, tractor.length, tractor.last])
    } else if (tractor.length === 1) {
      shape.push([count, 1, tractor.last])
    }
  }

  return shape.sort((a, b) => {
    const ac = a[0] * a[1]
    const bc = b[0] * b[1]
    if (ac > bc) return 1
    if (ac < bc) return -1
    if (a[0] > b[0]) return 1
    if (a[0] < b[0]) return -1
    if (a[2] > b[2]) return 1
    if (a[2] < b[2]) return -1
    return 0
  })
}

export function checkWinningHand(cards, trump, leadSuit, shape) {
  if (isTrash(cards, trump, leadSuit)) return false
  cards = sortHand(cards, trump)
  console.log(0)

  return recursiveCheckWinningHand(cards, trump, [...shape])
}

function recursiveCheckWinningHand(cards, trump, shape, myShape = [], winning = false) {
  if (shape.length === 0 && winning) return myShape.reverse()
  const [size, length, rank] = shape.pop()
  const count = size * length
  console.log([size, length, rank])
  for (let i = cards.length - count; i >= 0; i--) {
    const remainingCards = [...cards]
    const group = remainingCards.splice(i, count)
    // TODO fix mismatched sets of 3+ in the middle of a tractor
    console.log(group)
    if (!partMatch(group, trump, size)) continue
    console.log(1)
    if (!winning && trump.cardOrder[group.last] <= trump.cardOrder[rank]) continue
    console.log(2)
    myShape.push([size, length, group.last])
    const win = recursiveCheckWinningHand(remainingCards, trump, shape, myShape, true)
    console.log(win)
    if (win) return win
    myShape.pop()
  }
  shape.push([size, length, rank])
  return false
}

function partMatch(cards, trump, size) {
  const counts = countBy(cards)
  if (Object.values(counts).some((c) => c !== size)) return false
  let prev
  for (const card in counts) {
    if (prev && trump.cardOrder[card] !== trump.cardOrder[prev] + 1) return false
    prev = card
  }
  return true
}

function isTrash(cards, trump, leadSuit) {
  const suits = new Set()
  if (isTrump(cards[0], trump)) {
    suits.add("T")
  } else if (leadSuit) {
    suits.add(leadSuit)
  }
  for (const card of cards) {
    suits.add(getSuit(card, trump))
    if (suits.size > 1) return true
  }
  return false
}

window.cardHelpers = {
  buildDeck,
  sortHand,
  isTrump,
  getSuit,
  buildCardOrder,
  getHandShape,
  checkWinningHand,
}
