export const ADD_MARKER = 'ADD_MARKER'
export const SET_MARKER = 'SET_MARKER'
export const SET_POSITION = 'SET_POSITION'
export const SHOW_MAKE = 'SHOW_MAKE'
export const SHOW_VIEW = 'SHOW_VIEW'


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
