import { combineReducers } from "redux"
import connectionTestSlice from "./test/connectionTestSlice"
import connectFourSlice from "./connectFour/connectFourSlice"

function testSlice(state = {}, action) {
  console.log("dispatch", action)
  return {}
}

export const whichGame = window.location.href.split("/").last
let rootReducer

if (whichGame.startsWith("connectFour")) {
  rootReducer = combineReducers({ connectFour: connectFourSlice, test: testSlice })
} else {
  rootReducer = combineReducers({ connectionTest: connectionTestSlice, test: testSlice })
}

export default rootReducer
