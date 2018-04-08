import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import NavBarActionContainer from './nav_bar_action_container';
import PendingReqsContainer from './nav_bar_pending_reqs_container';
import PendingReqs from './nav_bar_pending_reqs';

class NavBar extends React.Component {
  constructor (props) {
    super (props);
    this.showActionsContainer = this.showActionsContainer.bind(this);
    this.showPendingRequests = this.showPendingRequests.bind(this);
  }

  handleLogout () {
    this.props.logout().then(this.props.history.push('/'));
  }

  componentWillUnmount() {
    this.props.hideDropdown();
  }

  showActionsContainer (e) {
    e.stopPropagation();
    this.props.showDropdown(<NavBarActionContainer />);
  }

  showPendingRequests (e) {
    e.stopPropagation();
    this.props.showDropdown(<PendingReqsContainer />);
  }

  render() {
    let link;
    let linkAndPic;
    if (!this.props.currentUser) {
      link = null;
      linkAndPic = null;
    } else {
      link = (
        <Link to={`/users/${this.props.currentUser.id}`}>
          {this.props.currentUser.name}
        </Link>
      );

      linkAndPic = (
        <Link to={`/users/${this.props.currentUser.id}`}>
          <img src={this.props.currentUser.profilePic}></img>
        </Link>
      );
    }
    return (
      <div className="nav-bar">
        <form id="search-form">
          <input placeholder="i do nothing yet"></input>
          <i className="fa fa-search" aria-hidden="true"></i>
        </form>

        <div>
          <div id="nav-bar-welcome-logout">
            { linkAndPic }
            <div className="user-pic-name-and-home">
              <p className="user-name">
                { link }
              </p>
              <p className="home-link">
                <Link to={`/feed`}>Home</Link>
              </p>
            </div>
            <div id="nav-bar-icons">
              <div id="first-three-icons">
                <i className="fa fa-users" aria-hidden="true" onClick={this.showPendingRequests}></i>
                <i className="fa fa-comments" aria-hidden="true"></i>
                <i className="fa fa-globe" aria-hidden="true"></i>
              </div>
              <div className='question-icon-and-options'>
                <i className="fa fa-question" aria-hidden="true" id="question"></i>
                <i className="fa fa-bars" aria-hidden="true" onClick={this.showActionsContainer}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NavBar);
