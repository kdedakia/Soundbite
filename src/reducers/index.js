import { combineReducers } from 'redux'
import markers from './markers'
import auth from './auth'

export default combineReducers({
  markers,
  auth
})
