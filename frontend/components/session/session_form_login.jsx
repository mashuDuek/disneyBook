import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/session_actions';

class SessionFormLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.demoLogin = this.demoLogin.bind(this);
  }

  handleEmail(e) {
    e.preventDefault();
    this.setState({email: e.currentTarget.value});
  }

  handlePassword(e) {
    e.preventDefault();
    this.setState({password: e.currentTarget.value});
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.processForm(this.state).then(() => {
      this.props.history.push('/feed');
    });
  }

  demoLogin(e) {
    e.preventDefault();
    this.props.processForm({
      email: 'mufasa@lionking.com',
      password: 'password'
    }).then(() => { this.props.history.push('/feed'); });
  }

  render () {

    if (this.props.loggedIn) <Redirect to="/feed" />;

    return (
      <div id='login'>
        <h1>disneyBook</h1>
        <form id='login-form'>
          <label>Email
            <input
              onChange={ this.handleEmail }
              value={ this.state.email } />
          </label>
          <br />
          <label>Password
            <input
              type="password"
              onChange={ this.handlePassword }
              value={ this.state.password } />
          </label>

          <button onClick={ this.handleSubmit }>Log In</button>
          <button onClick={ this.demoLogin }>Demo Mufasa</button>
        </form>
      </div>
    );
  }
}

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
