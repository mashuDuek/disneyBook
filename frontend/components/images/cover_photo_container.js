import CoverPhotoComponent from './cover_photo_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logout } from '../../actions/session_actions';
import { fetchUser } from '../../actions/user_actions';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';
import { showModal, hideModal } from '../../actions/modal_actions';
import { updateCoverPic } from '../../actions/image_actions';

const mapStatetoProps = (state, ownProps) => {
  let acceptedFriendIds;
  if (!state.entities.users[ownProps.match.params.userId]) {
    acceptedFriendIds = null;
  } else {
    acceptedFriendIds = (
      state.entities.users[ownProps.match.params.userId].accepted_friends
    );
  }

  return {
    pendingFriendIds: state.session.currentUser.pending_friends,
    user: state.entities.users[ownProps.match.params.userId],
    currentUser: state.session.currentUser || {},
    users: state.entities.users,
    errors: state.ui.errors,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showDropdown: (component) => dispatch(showDropdown(component)),
    showModal: (component) => dispatch(showModal(component)),
    hideDropdown: () => dispatch(hideDropdown()),
    hideModal: () => dispatch(hideModal()),
    logout: () => dispatch(logout()),
    fetchUser: (user) => dispatch(fetchUser(user)),
    updateCover: (image) => dispatch(updateCoverPic(image)),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(CoverPhotoComponent));
