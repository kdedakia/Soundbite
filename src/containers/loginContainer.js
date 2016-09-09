import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Login from '../components/common/login'

import * as AuthActions from '../actions/auth';

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    idToken: state.auth.idToken,
    refreshToken: state.auth.refreshToken
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AuthActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
