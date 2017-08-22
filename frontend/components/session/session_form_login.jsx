import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

class SessionFormLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', name: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
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

  render () {
    if (this.props.loggedIn) {
      return (
        <Redirect to="/" />
      );
    }

    return (
      <div>
        <h2>{this.props.formType}</h2>
        <form>
          <label>Email
            <input
              onChange={this.handleEmail}
              value={this.state.email} />
          </label>
          <br />
          <label>Password
            <input
              onChange={this.handlePassword}
              value={this.state.password} />
          </label>
          <button onClick={this.handleSubmit}>Login</button>
        </form>
      </div>
    );
  }
}

export default withRouter(SessionFormLogin);
