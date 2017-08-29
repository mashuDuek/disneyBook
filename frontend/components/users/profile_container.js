import ProfileComponent from './profile_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../../actions/session_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || {},
    users: state.users,
    errors: state.errors,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfileComponent));
