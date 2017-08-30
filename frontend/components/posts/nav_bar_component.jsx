import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class NavBar extends React.Component {
    constructor (props) {
      super(props);
    }

    handleLogout() {
      this.props.logout().then(this.props.history.push('/'));
    }

    render() {

      return (
        <div className="nav-bar">

          <form id="search-form">
            <input placeholder="i do nothing yet"></input>
              <i class="fa fa-meetup" aria-hidden="true"></i>
          </form>
          <div id="nav-bar-welcome-logout">
            <img src={this.props.currentUser.profilePicUrl}></img>
            <div>
              <p className="user-name">
                <Link to={`/users/${this.props.currentUser.id}`}>
                  {this.props.currentUser.name}
                </Link>
              </p>
              <p className="home-link">
                <Link to={`/feed`}>Home</Link>
              </p>
            </div>
            <button onClick={this.handleLogout.bind(this)}>Logout</button>
          </div>

        </div>
      )
    }
}

export default withRouter(NavBar);
