import ProfileComponent from './profile_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../../actions/session_actions';
import { fetchUser } from '../../actions/user_actions';

const mapStatetoProps = (state, ownProps) => {
  debugger
  return {
    user: state.users[ownProps.match.params.userId],
    currentUser: state.session.currentUser || {},
    errors: state.errors,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => dispatch(logout()),
    fetchUser: (user) => dispatch(fetchUser(user)),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfileComponent));
