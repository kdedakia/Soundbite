import * as DB from '../utils/database'
import { initializeApp } from 'firebase';
import {
  AsyncStorage
} from 'react-native'

export const ADD_MARKER = 'ADD_MARKER'
export const REMOVE_MARKER = 'REMOVE_MARKER'
export const UPDATE_MARKER = 'UPDATE_MARKER'

export const SET_MARKER = 'SET_MARKER'
export const SET_POSITION = 'SET_POSITION'
export const SHOW_MAKE = 'SHOW_MAKE'
export const SHOW_VIEW = 'SHOW_VIEW'

export const REQUEST_MARKERS = 'REQUEST_MARKERS'
export const RECEIVE_MARKERS = 'RECEIVE_MARKERS'
export const REQUEST_BITE = 'REQUEST_BITE'
export const RECEIVE_BITE = 'RECEIVE_BITE'

export const UPVOTE = 'UPVOTE'
export const CANCEL_UPVOTE = 'CANCEL_UPVOTE'
export const DOWNVOTE = 'DOWNVOTE'
export const CANCEL_DOWNVOTE = 'CANCEL_DOWNVOTE'

export const GET_LISTENED = 'GET_LISTENED'
export const SET_LISTENED = 'SET_LISTENED'

export function addMarker(data) {
  return { type: ADD_MARKER, data }
}

export function removeMarker(f_id) {
  return { type: REMOVE_MARKER, f_id }
}

export function updateMarker(data) {
  return { type: UPDATE_MARKER, data }
}

export function setMarker(id) {
  return { type: SET_MARKER, id }
}

export function setPosition(pos) {
  return { type: SET_POSITION, pos }
}

export function showMake(show) {
  return { type: SHOW_MAKE, show }
}

export function showView(show) {
  return { type: SHOW_VIEW, show }
}

function requestMarkers(loc) {
  return { type: REQUEST_MARKERS, loc }
}

function receiveMarkers(loc,json) {
  return {
    type: RECEIVE_MARKERS,
    loc,
    json,
    receivedAt: Date.now()
  }
}

export function fetchMarkers(loc) {
  return dispatch => {
    dispatch(requestMarkers(loc))
    return DB.getMarkers()
      .then(json => dispatch(receiveMarkers(loc,json)))
      .catch((err) => console.log("Fetching Markers Error: " + err))
  }
}

function requestBite(file) {
  return { type: REQUEST_BITE, file }
}

function receiveBite(file) {
  return { type : RECEIVE_BITE, file }
}

export function fetchBite(file) {
  return dispatch => {
    dispatch(requestBite(file))
    DB.getFile(file)
      .then(() => {
        dispatch(receiveBite(file))
      })
  }
}

// TODO: use these functions
function shouldFetchMarkers(state, loc) {
  const markers = state.markers.markersList;
  if (!markers) {
    return true
  } else if (markers.isFetching) {
    return false
  }
  return false
}

export function fetchMarkersIfNeeded(loc) {
  return (dispatch, getState) => {
    if (shouldFetchMarkers(getState(), loc)) {
      return dispatch(fetchMarkers(loc))
    }
  }
}

export function upvote(markerId,userId,f_id) {
  firebase.database().ref().child('markers').child(markerId).child('upvotes').push({user:userId});

  return { type: UPVOTE, f_id, userId }
}

export function cancelUpvote(markerId,userId) {
  var voteRef = firebase.database().ref().child('markers').child(markerId).child('upvotes');

  voteRef.orderByChild('user').equalTo(userId).on('value',(snapshot) => {
    snapshot.forEach((data) => {
      voteRef.child(data.key).remove()
    })
  })
  voteRef.off();

  return { type: CANCEL_UPVOTE }
}

export function downvote(markerId,userId,f_id) {
  firebase.database().ref().child('markers').child(markerId).child('downvotes').push({user:userId});

  return { type: DOWNVOTE, f_id, userId }
}

export function cancelDownvote(markerId,userId) {
  var voteRef = firebase.database().ref().child('markers').child(markerId).child('downvotes');

  voteRef.orderByChild('user').equalTo(userId).on('value',(snapshot) => {
    snapshot.forEach((data) => {
      voteRef.child(data.key).remove()
    })
  })
  voteRef.off();

  return { type: CANCEL_DOWNVOTE }
}

export function getListened(listened) {
  return { type: GET_LISTENED, listened }
}

// TODO: Find better place to put AsyncStorage
export function setListened(markerId,userId) {
  AsyncStorage.getItem(userId)
  .then((listened) => {
    arr = JSON.parse(listened);
    if(arr.indexOf(markerId) == -1) {
      arr.push(markerId)
      AsyncStorage.setItem(userId,JSON.stringify(arr))
    }
  }).catch((err) => {
    AsyncStorage.setItem(userId,JSON.stringify([markerId]))
  })

  return { type: SET_LISTENED, markerId }
}
