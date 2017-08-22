import React from 'react';
import SignUpInfoComponent from './sign_up_info_component';
import SessionFooter from './session_footer';
import { Link, Redirect, withRouter } from 'react-router-dom';


class SessionFormSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', name: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleMovie = this.handleMovie.bind(this);
  }

  handleEmail(e) {
    e.preventDefault();
    this.setState({email: e.currentTarget.value});
  }

  handleName(e) {
    e.preventDefault();
    this.setState({name: e.currentTarget.value});
  }

  handleMovie(e) {
    e.preventDefault();
    this.setState({movie: e.currentTarget.value});
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

    let name;
    if (this.state.name) {
      name = this.state.name;
    } else {
      name = '  Full Name';
    }

    let email;
    if (this.state.email) {
      email = this.state.email;
    } else {
      email = '  Email';
    }

    let password;
    if (this.state.password) {
      password = this.state.password;
    } else {
      password = '  Password';
    }

    let movie;
    if (this.state.movie) {
      movie = this.state.movie;
    } else {
      movie = '  Movie';
    }

    return (
      <div className="signup-info">

        <SignUpInfoComponent />

        <div className='signup-form'>
          <h1>Sign Up</h1>
          <h5>It's free and always will be</h5>

          <form id='sign-up-form'>
            <input
              onChange={this.handleName}
              value={name}
              id="name-input"
            />
            <br />
            <input
              onChange={this.handleMovie}
              value={movie}
              id="movie-input"
            />
            <br />
            <input
              onChange={this.handleEmail}
              value={email}
              id="email-input"
            />
            <br />
            <input
              onChange={this.handlePassword}
              value={password}
              id="password-input"
            />
            <br />
            <div id="disclaimer">
              <p>By clicking Create Account, you agree that although your</p>
              <p>character may be a villain, you, in real life are not. If you</p>
              <p>are found in violation of this you will be kicked off our site.</p>
            </div>

            <button onClick={this.handleSubmit}>Create Account</button>
          </form>

        </div>

      </div>

    );
  }
}

export default withRouter(SessionFormSignUp);
