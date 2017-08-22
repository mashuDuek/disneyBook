import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
  }

  handleUsername (e) {
    e.preventDefault();
    this.setState({username: e.currentTarget.value});
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

    let link;
    if (this.props.formType === 'login') {
      link = (
        <Link to="/signup">Sign Up</Link>
      );
    } else {
      link = (
        <Link to="/login">Log In</Link>
      );
    }
    return (
      <div>
        <h2>{this.props.formType}</h2>
        {link}
        <form>
          <label>Username
            <input
              onChange={this.handleUsername}
              value={this.state.username} />
          </label>
          <br />
          <label>Password
            <input
              onChange={this.handlePassword}
              value={this.state.password} />
          </label>
          <button onClick={this.handleSubmit}>{this.props.formType}</button>
        </form>
      </div>
    );
  }
}

export default withRouter(SessionForm);
