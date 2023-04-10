import { hostId } from "../../peerjsMiddleware/hostId"

export const initialState = {
  hostId,
  players: [],
  teams: [[], []],
  words: [
    ["????", "????", "????", "????"],
    ["????", "????", "????", "????"],
  ],
  rounds: [[], []],
  score: [
    { interceptions: 0, miscommunications: 0 },
    { interceptions: 0, miscommunications: 0 },
  ],
  corrects: [],
  revealState: null,
  errors: {},
}
