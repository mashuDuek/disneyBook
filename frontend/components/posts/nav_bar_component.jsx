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
          </form>
          <div id="nav-bar-welcome-logout">
            <p >Hello, {this.props.currentUser.name}</p>
            <button onClick={this.handleLogout.bind(this)}>Logout</button>
          </div>

        </div>
      )
    }
}

export default withRouter(NavBar);


// BELOW FOR THE SEARCH BUTTON

// <button>
//   <i className="fa fa-search" aria-hidden="true"></i>
// </button>
