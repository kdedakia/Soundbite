import {
  LOGIN,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
} from '../actions/auth';

const initialState = {
  user: null,
  idToken: null,
  refreshToken: null,
  isLoggingIn: false,
  isAuthenticated: false,
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
    default:
      return state;
  }
}
