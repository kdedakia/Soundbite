// import fetch from 'isomorphic-fetch'

export const ADD_MARKER = 'ADD_MARKER'
export const SET_MARKER = 'SET_MARKER'
export const SET_POSITION = 'SET_POSITION'
export const SHOW_MAKE = 'SHOW_MAKE'
export const SHOW_VIEW = 'SHOW_VIEW'

export const REQUEST_MARKERS = 'REQUEST_MARKERS'
export const RECEIVE_MARKERS = 'RECEIVE_MARKERS'


export function addMarker(data) {
  return { type: ADD_MARKER, data }
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
    return fetch(`https://dedakia2-2f9d5.firebaseio.com/markers.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveMarkers(loc,json)))
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
