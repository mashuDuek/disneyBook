import ProfileComponent from './profile_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../../actions/session_actions';
import { fetchUser } from '../../actions/user_actions';
import { fetchAllComments } from '../../actions/comment_actions';
import { createFriendship } from '../../actions/friendship_actions';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';
import { showModal, hideModal } from '../../actions/modal_actions';
import { updateCoverPic } from '../../actions/image_actions';

const mapStatetoProps = (state, ownProps) => {
  let acceptedFriends;
  if (!state.session.currentUserProfile) {
    acceptedFriends = null;
  } else {
    acceptedFriends = state.session.currentUserProfile.acceptedFriends;
  }

  return {
    acceptedFriends,
    pendingFriendIds: state.session.currentUser.pendingFriends,
    user: state.entities.users[ownProps.match.params.userId],
    currentUser: state.session.currentUser || {},
    dropdowns: state.ui.dropdowns,
    users: state.entities.users,
    errors: state.ui.errors,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(logout()),
    hideDropdown: () => dispatch(hideDropdown()),
    fetchUser: (user) => dispatch(fetchUser(user)),
    createFriendship: (user) => dispatch(createFriendship(user)),
    showDropdown: (component) => dispatch(showDropdown(component)),
    showModal: (component) => dispatch(showModal(component)),
    hideModal: () => dispatch(hideModal()),
    updateCover: (image) => dispatch(updateCoverPic(image)),
    fetchAllComments: () => dispatch(fetchAllComments())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfileComponent));
