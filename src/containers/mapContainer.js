import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapBox from '../components/common/map'

import * as MarkerActions from '../actions/markers';

function mapStateToProps(state) {
  return {
    markers: state.markers.markersList,
    position: state.markers.position,
    overlay: state.markers.overlay
  }
}

// TODO: send only relevant actions? does this really matter..
function mapDispatchToProps(dispatch) {
  return bindActionCreators(MarkerActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapBox)
