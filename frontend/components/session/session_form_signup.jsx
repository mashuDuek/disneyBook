import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

class SessionFormSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', name: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleName = this.handleName.bind(this);
  }

  handleEmail(e) {
    e.preventDefault();
    this.setState({email: e.currentTarget.value});
  }

  handleName(e) {
    e.preventDefault();
    this.setState({name: e.currentTarget.value});
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
          <label>Name
            <input
              onChange={this.handleName}
              value={this.state.name} />
          </label>
          <br />
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
          <button onClick={this.handleSubmit}>SignUp</button>
        </form>
      </div>
    );
  }
}

export default withRouter(SessionFormSignUp);
