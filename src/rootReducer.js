import { combineReducers } from "redux"
import connectionTestSlice from "./test/connectionTestSlice"
import connectFourSlice from "./connectFour/connectFourSlice"
import zhaoPengyouReducer from "./zhaoPengyou/zhaoPengyouReducer"

function testSlice(state = {}, action) {
  console.log("dispatch", action)
  return {}
}

export const whichGame = window.location.href.split("/").last
let rootReducer

if (whichGame.startsWith("connectFour")) {
  rootReducer = combineReducers({ connectFour: connectFourSlice, test: testSlice })
} else if (whichGame.startsWith("zhaoPengyou")) {
  rootReducer = zhaoPengyouReducer
} else {
  rootReducer = combineReducers({ connectionTest: connectionTestSlice, test: testSlice })
}

export default rootReducer
