export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGOUT = 'LOGOUT'
export const REFRESH_ID = 'REFRESH_ID'

import {
  AsyncStorage,
} from 'react-native';
import AuthService from '../utils/authservice';

let auth = new AuthService('sOp1QvEWdBH9wI2X7SZr1EANlG8fY3es','dedakia.auth0.com');

export function login() {
  return dispatch => {
    dispatch(loginRequest())
    auth.lock.show({closable: true}, (err,profile,token) => {
      if(err) {
        dispatch(loginError(err))
        return
      } else {
        AsyncStorage.multiSet([['idToken',token.idToken],['refreshToken',token.refreshToken],['user',JSON.stringify(profile)]])
        dispatch(loginSuccess(profile,token.idToken,token.refreshToken))
      }
    })
  }
}

function loginRequest() {
  return { type: LOGIN_REQUEST }
}

// ToDo: simplify
export function loginSuccess(profile,idToken,refreshToken) {
  return { type: LOGIN_SUCCESS, profile, idToken: idToken, refreshToken: refreshToken }
}

function loginError(err) {
  return { type: LOGIN_ERROR, err }
}

export function logout() {
  AsyncStorage.multiRemove(['idToken','refreshToken','user'], (err) => {
    if (err) {
      console.error(err);
    }
  });
  return { type: LOGOUT }
}

export function refreshId(refreshToken) {
  return dispatch => {
    auth.auth
    .authentication('sOp1QvEWdBH9wI2X7SZr1EANlG8fY3es')
      .refreshToken(refreshToken)
      .then(response => {
        dispatch(setIdToken(response.id_token))
        return
      })
      .catch(error => {
        console.log(error)
      });
  }
}

function setIdToken(idToken) {
  AsyncStorage.setItem('idToken',idToken);
  return { type: REFRESH_ID, idToken }
}
