import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../actions/auth';

const initialState = {
  user: null,
  idToken: null,
  refreshToken: null,
}

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log("LOGGED IN",action.profile)
      return Object.assign({}, state, {user: action.profile, idToken: action.idToken, refreshToken: action.refreshToken })
    case LOGIN_ERROR:
      console.log("LOG IN ERROR")
      return state
    default:
      return state;
  }
}
