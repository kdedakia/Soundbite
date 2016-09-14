import {
  LOGIN,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  REFRESH_ID,
  REQUEST_FIREBASE,
  FIREBASE_SUCCESS,
  FIREBASE_ERROR,
} from '../actions/auth';

const initialState = {
  user: null,
  idToken: null,
  refreshToken: null,
  isLoggingIn: false,
  isAuthenticated: false,
  isRefreshingFirebase: false,
  firebaseToken: null,
}

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {isLoggingIn: true});
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {user: action.profile, idToken: action.idToken, refreshToken: action.refreshToken,isLoggingIn: false, isAuthenticated: true })
    case LOGIN_ERROR:
      return state
    case LOGOUT:
      return Object.assign({}, state, {user: null, idToken: null, refreshToken: null, isAuthenticated: false })
    case REFRESH_ID:
      return Object.assign({}, state, {idToken: action.idToken})
    case REQUEST_FIREBASE:
      return Object.assign({},state, {isRefreshingFirebase: true})
    case FIREBASE_SUCCESS:
      return Object.assign({},state, {firebaseToken: action.fbToken, isRefreshingFirebase: false})
    case FIREBASE_ERROR:
      console.error("Firebase Error: " + action.error)
      return Object.assign({},state, {isRefreshingFirebase: false})
    default:
      return state;
  }
}
