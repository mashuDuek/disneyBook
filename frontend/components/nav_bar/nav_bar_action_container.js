import { connect } from 'react-redux';
import NavBarActionComponent from './nav_bar_actions_component';
import { withRouter } from 'react-router-dom';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';
import { logout } from '../../actions/session_actions';


const mapStatetoProps = (state, ownProps) => {
  return {
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
)(NavBarActionComponent));
