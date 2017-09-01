import ProfileBarComponent from './profile_bar_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createFriendship } from '../../actions/friendship_actions';

// import { logout } from '../../actions/session_actions';
const mapStatetoProps = (state, ownProps) => {
  debugger
  return {
    user: state.users[ownProps.match.params.userId],
    currentUser: state.session.currentUser || {},
    pendingFriendIds: state.session.currentUser.pending_friends,
    acceptedFriendIds: state.session.currentUser.accepted_friends,
    users: state.users,
    errors: state.errors,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createFriendship: (user) => dispatch(createFriendship(user)),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfileBarComponent));
