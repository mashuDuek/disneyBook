import { connect } from 'react-redux';
import SessionFormSignUp from './session_form_signup';
import { login, signup } from '../../actions/session_actions';
import { withRouter } from 'react-router-dom';


const mapStatetoProps = (state, ownProps) => {
  return {
    loggedIn: Boolean(state.session.currentUser),
    errors: state.session.errors,
    formType: "signup"
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    processForm: (user) => dispatch(signup(user))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(SessionFormSignUp));
