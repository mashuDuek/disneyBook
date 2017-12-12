import ProfileComponent from './profile_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../../actions/session_actions';
import { fetchUser } from '../../actions/user_actions';
import { createFriendship } from '../../actions/friendship_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    user: state.users[ownProps.match.params.userId],
    pendingFriendIds: state.session.currentUser.pending_friends,
    acceptedFriendIds: state.session.currentUser.accepted_friends,
    users: state.users,
    currentUser: state.session.currentUser || {},
    errors: state.errors,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(logout()),
    fetchUser: (user) => dispatch(fetchUser(user)),
    createFriendship: (user) => dispatch(createFriendship(user))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfileComponent));
