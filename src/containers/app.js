import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/common/main'
import * as MarkerActions from '../actions/markers';

function mapStateToProps(state) {
  return {
    m: state.markers
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MarkerActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
