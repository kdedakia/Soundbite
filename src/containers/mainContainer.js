import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/common/main'

import * as MarkerActions from '../actions/markers';
import * as AuthActions from '../actions/auth';

function mapStateToProps(state) {
  return {
    user: state.auth.user
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},AuthActions,MarkerActions), dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
