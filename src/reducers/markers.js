import {
  ADD_MARKER,
  REMOVE_MARKER,
  UPDATE_MARKER,
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
      for (var idx in state.markersList) {
        state.markersList[idx].f_id != action.f_id ? newMarkersList.push(state.markersList[idx]) : null
      }
      return Object.assign({}, state, {markersList: newMarkersList })
    case UPDATE_MARKER:
      let newMarkersList = JSON.parse(JSON.stringify(state.markersList));
      let newCurrMarker = JSON.parse(JSON.stringify(state.currMarker));

      for(var idx in newMarkersList) {
        if (newMarkersList[idx].f_id == action.data.f_id) {
          if (typeof action.data.upvotes != "undefined") {
            newMarkersList[idx].upvotes = Object.keys(action.data.upvotes).map((v) => {return action.data.upvotes[v]})
          } else {
            newMarkersList[idx].upvotes = [];
          }

          if (typeof action.data.downvotes != "undefined") {
            newMarkersList[idx].downvotes = Object.keys(action.data.downvotes).map((v) => {return action.data.downvotes[v]})
          } else {
            newMarkersList[idx].downvotes = [];
          }

          if (action.data.f_id == state.currMarker.f_id) {
            newCurrMarker.upvotes = newMarkersList[idx].upvotes;
            newCurrMarker.downvotes = newMarkersList[idx].downvotes;
          }
          break;
        }
      }
      return Object.assign({}, state, {markersList: newMarkersList, currMarker: newCurrMarker })
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
        let m = action.json[key];
        if (typeof m.upvotes != "undefined") {
          let upvotes = Object.keys(m.upvotes).map((v) => {return m.upvotes[v]})
          m["upvotes"] = upvotes;
        } else {
          m["upvotes"] = [];
        }
        if (typeof m.downvotes != "undefined") {
          let downvotes = Object.keys(m.downvotes).map((v) => {return m.downvotes[v]})
          m["downvotes"] = downvotes;
        } else {
          m["downvotes"] = [];
        }
        m["firebaseId"] = key;
        markers.push(m);
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
