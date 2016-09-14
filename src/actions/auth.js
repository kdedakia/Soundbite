export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGOUT = 'LOGOUT'
export const REFRESH_ID = 'REFRESH_ID'

export const GET_FIREBASE = 'GET_FIREBASE'
export const REFRESH_FIREBASE = 'REFRESH_FIREBASE'
export const REQUEST_FIREBASE = 'REQUEST_FIREBASE'
export const FIREBASE_SUCCESS = 'FIREBASE_SUCCESS'
export const FIREBASE_ERROR = 'FIREBASE_ERROR'

import { fetchMarkers } from './markers'
import {
  AsyncStorage,
} from 'react-native';
import AuthService from '../utils/authservice';
import * as DB from '../utils/database';
import { isTokenExpired } from '../utils/jwthelper'

let auth = new AuthService('sOp1QvEWdBH9wI2X7SZr1EANlG8fY3es','dedakia.auth0.com');

// Get user data from AsyncStorage. Get Firebase token. Refresh idToken if needed.
export function getUser() {
  return dispatch => {
    AsyncStorage.multiGet(['user','idToken','refreshToken'])
    .then((results) => {
      var user = JSON.parse(results[0][1])
      var idToken = results[1][1]
      var refreshToken = results[2][1]

      if(user != null) {
        dispatch(loginSuccess(user,idToken,refreshToken))
        dispatch(getFirebase(idToken))
        dispatch(fetchMarkers())
      }
      if (isTokenExpired(idToken)) {
        dispatch(refreshId(refreshToken)) //Should always occur after loginSuccess
      }
    })
    .catch((err) => console.error("Get User Error: " + err))
  }
}

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
      console.error("Logout Error:" + err);
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
        console.log("Refresh ID Error: " + error)
      });
  }
}

function setIdToken(idToken) {
  AsyncStorage.setItem('idToken',idToken);
  return { type: REFRESH_ID, idToken }
}

// Use existing token if possible, else refresh
export function getFirebase(idToken) {
  return dispatch => {
    AsyncStorage.getItem('firebaseToken')
    .then((fbToken) => {
      if(fbToken == null || isTokenExpired(fbToken)) {
        dispatch(refreshFirebase(idToken));
      } else {
        DB.signIn(fbToken).then(() => dispatch(firebaseSuccess(fbToken)))
      }
    });
  }
}

export function refreshFirebase(idToken) {
  return dispatch => {
    fetch('https://dedakia.auth0.com/delegation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: 'sOp1QvEWdBH9wI2X7SZr1EANlG8fY3es',
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        id_token: idToken,
        target: 'sOp1QvEWdBH9wI2X7SZr1EANlG8fY3es',
        scope: 'openid',
        api_type: 'firebase',
      })
    })
    .then((response) => {
      let fbToken = JSON.parse(response._bodyText).id_token;
      if(fbToken == null) {
        dispatch(firebaseError(JSON.parse(response._bodyText).error_description))
      }

      AsyncStorage.setItem('firebaseToken',fbToken);
      DB.signIn(fbToken)
      .then(() => {
        dispatch(firebaseSuccess(fbToken))
        dispatch(fetchMarkers())
      })

    })
    .catch((err) => dispatch(firebaseError(err)));
  }

}

function requestFirebase() {
  return { type: REQUEST_FIREBASE }
}

function firebaseSuccess(fbToken) {
  return { type: FIREBASE_SUCCESS, fbToken }
}

function firebaseError(error) {
  return { type: FIREBASE_ERROR, error }
}
