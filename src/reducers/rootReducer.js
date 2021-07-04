import { combineReducers } from "redux"
import connectionTestSlice from "./connectionTestSlice"

function testSlice(state = {}, action) {
  console.log("dispatch", action)
  return {}
}

export default combineReducers({ connectionTest: connectionTestSlice, test: testSlice })
