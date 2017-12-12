import { connect } from 'react-redux';
import PendingReqs from './nav_bar_pending_reqs';
import { withRouter } from 'react-router-dom';
import { showDropdown } from '../../actions/dropdown_actions';

const mapStatetoProps = (state, ownProps) => {
  debugger
  return {
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PendingReqs));
