import { connect } from 'react-redux';
import NavBar from './nav_bar_component';
import { withRouter } from 'react-router-dom';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';
import { logout } from '../../actions/session_actions';


const mapStatetoProps = (state, ownProps) => {
  return {
    pendingFriends: state.session.currentUser.pendingFriends,
    currentUser: state.session.currentUser,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideDropdown: () => dispatch(hideDropdown()),
    showDropdown: (comp) => dispatch(showDropdown(comp)),
    logout: () => dispatch(logout())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(NavBar));
