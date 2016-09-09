import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MakeBite from '../components/common/make'

import * as MarkerActions from '../actions/markers';

function mapStateToProps(state) {
  return {
    overlay: state.markers.overlay,
    position: state.markers.position,
    user: state.auth.user,
    idToken: state.auth.idToken,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MarkerActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MakeBite)
