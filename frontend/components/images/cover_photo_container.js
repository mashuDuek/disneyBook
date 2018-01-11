import CoverPhotoComponent from './profile_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logout } from '../../actions/session_actions';
import { fetchUser } from '../../actions/user_actions';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';
import { showModal } from '../../actions/modal_actions';
import { updateCoverPic } from '../../actions/image_actions';

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
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(logout()),
    hideDropdown: () => dispatch(hideDropdown()),
    fetchUser: (user) => dispatch(fetchUser(user)),
    showDropdown: (component) => dispatch(showDropdown(component)),
    showModal: (component) => dispatch(showModal(component)),
    updateCover: (image) => dispatch(updateCoverPic(image))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(CoverPhotoComponent));
