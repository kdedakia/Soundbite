import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from '../reducers'
// import syncOffline from './syncOffline'

const logger = createLogger()

export default function configureStore(initialState) {
  const store = createStore(
    reducer,
    applyMiddleware(thunk,logger)
  )
  // syncOffline(store)

  return store
}
