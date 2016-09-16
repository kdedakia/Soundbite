import {
  ADD_MARKER,
  REMOVE_MARKER,
  SET_MARKER,
  SET_POSITION,
  SHOW_MAKE,
  SHOW_VIEW,
  REQUEST_MARKERS,
  RECEIVE_MARKERS,
  REQUEST_BITE,
  RECEIVE_BITE
} from '../actions/markers';

const initialState = {
  markersList: [],
  currMarker: null,
  position: {},
  user: null,
  overlay: null,
  popup: null,
  settings: null,
  isFetching: false,
  fetchingBite: false,
}

export default function reducer(state=initialState, action) {

  switch (action.type) {
    case ADD_MARKER:
      var newMarkersList = state.markersList;
      newMarkersList.push(action.data);
      return Object.assign({}, state, {markersList: newMarkersList, overlay: null})
    case REMOVE_MARKER:
      var newMarkersList = [];
      for (var idx in newMarkersList) {
        if (newMarkersList[key].f_id != action.f_id) {
          newMarkersList.push(newMarkersList[idx])
          break;
        }
      }
      return Object.assign({}, state, {markersList: newMarkersList })
    case SET_POSITION:
      return Object.assign({}, state, {position: action.pos})
    case SHOW_MAKE:
      if (action.show) {
        return Object.assign({}, state, {overlay: "MAKE"})
      } else {
        return Object.assign({}, state, {overlay: null})
      }
    case SHOW_VIEW:
      if (action.show) {
        return Object.assign({}, state, {overlay: "VIEW"})
      } else {
        return Object.assign({}, state, {overlay: null})
      }
    case SET_MARKER:
      for (var i = 0; i < state.markersList.length; i++) {
        if (state.markersList[i].id == action.id) {
          return Object.assign({}, state, {currMarker: state.markersList[i], overlay: "VIEW"})
        }
      }
      console.log("ERROR: COULDN'T FIND MARKER");
      return Object.assign({}, state, {currMarker: null})
    case REQUEST_MARKERS:
      return Object.assign({}, state, {isFetching: true})
    case RECEIVE_MARKERS:
      var markers = [];
      for (key in action.json) {
        markers.push(action.json[key]);
      }
      return Object.assign({}, state, {isFetching: false, lastUpdated: action.receivedAt, markersList: markers})
    case REQUEST_BITE:
      return Object.assign({}, state, {fetchingBite: true})
    case RECEIVE_BITE:
      return Object.assign({}, state, {fetchingBite: false})
    default:
      return state
  }
}
