import { connect } from 'react-redux';
import SessionForm from './session_form';
import { login, signup } from '../../actions/session_actions';
import { withRouter } from 'react-router-dom';


const mapStatetoProps = (state, ownProps) => {
  const button = ownProps.location.pathname === '/login' ? 'login' : 'signup';
  return {
    loggedIn: Boolean(state.session.currentUser),
    errors: state.session.errors,
    formType: `${button}`
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const action = (ownProps.location.pathname === '/login') ? login : signup;
  return {
    processForm: (user) => dispatch(action(user))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(SessionForm));
