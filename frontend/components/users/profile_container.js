import ProfileComponent from './profile_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../../actions/session_actions';
import { fetchUser } from '../../actions/user_actions';
import { createFriendship } from '../../actions/friendship_actions';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';

const mapStatetoProps = (state, ownProps) => {
  let acceptedFriendIds;
  if (!state.users[ownProps.match.params.userId]) {
    acceptedFriendIds = null;
  } else {
    acceptedFriendIds = state.users[ownProps.match.params.userId].accepted_friends;
  }
  
  return {
    pendingFriendIds: state.session.currentUser.pending_friends,
    user: state.users[ownProps.match.params.userId],
    currentUser: state.session.currentUser || {},
    users: state.users,
    errors: state.errors,
    acceptedFriendIds,
    dropdowns: state.dropdowns
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(logout()),
    hideDropdown: () => dispatch(hideDropdown()),
    fetchUser: (user) => dispatch(fetchUser(user)),
    createFriendship: (user) => dispatch(createFriendship(user)),
    showDropdown: (component) => dispatch(showDropdown(component))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfileComponent));
