import { connect } from 'react-redux';
import PendingReqs from './nav_bar_pending_reqs';
import { withRouter } from 'react-router-dom';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    pendingFriends: state.session.currentUser.pending_friends
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideDropdown: () => dispatch(hideDropdown())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PendingReqs));
