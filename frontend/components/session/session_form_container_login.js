import { connect } from 'react-redux';
import SessionFormLogin from './session_form_login';
import { login, signup } from '../../actions/session_actions';
import { withRouter } from 'react-router-dom';


const mapStatetoProps = (state, ownProps) => {
  return {
    loggedIn: Boolean(state.session.currentUser),
    errors: state.session.errors,
    formType: "login"
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  
  return {
    processForm: (user) => dispatch(login(user))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(SessionFormLogin));
