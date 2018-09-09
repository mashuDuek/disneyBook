import { connect } from 'react-redux';
import NavBar from './nav_bar_component';
import { withRouter } from 'react-router-dom';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';
import { fetchSearchedUsers } from '../../actions/user_actions';
import { logout } from '../../actions/session_actions';


const mapStatetoProps = (state, ownProps) => {
  let pendingFriends;
  if (!state.session.currentUser) {
    pendingFriends = null;
  } else {
    pendingFriends = state.session.currentUser.pendingFriends;
  }

  // here, instead of grabbing currentUser from session slice,
  // should be grabbed from entities.users, given the currentUserId
  return {
    pendingFriends,
    currentUser: state.entities.users[state.session.currentUser.id],
    searchedUsers: state.entities.search
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideDropdown: () => dispatch(hideDropdown()),
    showDropdown: (comp) => dispatch(showDropdown(comp)),
    fetchSearchedUsers: input => dispatch(fetchSearchedUsers(input)),
    logout: () => dispatch(logout())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(NavBar));
