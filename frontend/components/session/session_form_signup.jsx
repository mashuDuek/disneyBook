import React from 'react';
import SignUpInfoComponent from './sign_up_info_component';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup } from '../../actions/session_actions';

class SessionFormSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', name: '', movie: '' };

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
    if (this.props.loggedIn) <Redirect to="/feed" />;

    return (
      <div id="signup-info">

        <SignUpInfoComponent />

        <div id='signup-form'>
          <h1>Sign Up</h1>
          <h4>It's free and always will be</h4>

          <form id='sign-up-form'>
            <input
              onChange={this.handleName}
              value={this.state.name}
              placeholder=' Name'
              id="name-input"
            />
            <br />
            <input
              onChange={this.handleMovie}
              value={this.state.movie}
              placeholder=' Movie'
              id="movie-input"
            />
            <br />
            <input
              onChange={this.handleEmail}
              value={this.state.email}
              placeholder=' Email'
              id="email-input"
            />
            <br />
            <input
              onChange={this.handlePassword}
              value={this.state.password}
              placeholder=' Password'
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

