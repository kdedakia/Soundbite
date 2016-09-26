import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Profile from '../components/common/profile'

import * as AuthActions from '../actions/auth';
import * as MarkerActions from '../actions/markers';

function mapStateToProps(state) {
  return {
    overlay: state.markers.overlay,
    user: state.auth.user,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},MarkerActions,AuthActions), dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
