import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ViewBite from '../components/common/view'

import * as MarkerActions from '../actions/markers';

function mapStateToProps(state) {
  return {
    overlay: state.markers.overlay,
    currMarker: state.markers.currMarker
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MarkerActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewBite)
