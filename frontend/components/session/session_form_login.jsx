import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

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
    this.props.processForm(this.state);
  }

  demoLogin(e) {
    e.preventDefault();
    this.props.processForm({ email: 'mufasa@lionking.com', password: 'password' });
  }

  render () {

    if (this.props.loggedIn) {
      return (
        <Redirect to="/" />
      );
    }
    return (
      <div id='login'>
        <h1>disneyBook</h1>
        <form id='login-form'>
          <label>Email
            <input
              onChange={this.handleEmail}
              value={this.state.email} />
          </label>
          <br />
          <label>Password
            <input
              type="password"
              onChange={this.handlePassword}
              value={this.state.password} />
          </label>

          <button onClick={this.handleSubmit}>Log In</button>
          <button onClick={this.demoLogin}>Demo Mufasa</button>
        </form>
      </div>
    );
  }
}

export default withRouter(SessionFormLogin);
