import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import NavBarActionComponent from './nav_bar_actions_component';

class NavBar extends React.Component {
    constructor (props) {
      super(props);
      this.state = { actionsVisible: false };
      this.toggleActionVisibility = this.toggleActionVisibility.bind(this);
    }

    handleLogout() {
      this.props.logout().then(this.props.history.push('/'));
    }

    toggleActionVisibility () {
      
      this.setState({ actionsVisible: !this.state.actionsVisible })
    }

    render() {
      let actionsComponent;
      if (this.state.actionsVisible) {
        actionsComponent = (<NavBarActionComponent logout={this.props.logout} />)
      } else {
        actionsComponent = null;
      }
      return (
        <div className="nav-bar">

          <form id="search-form">
            <input placeholder="i do nothing yet"></input>
            <i className="fa fa-search" aria-hidden="true"></i>
          </form>
          <div>

            <div id="nav-bar-welcome-logout">
              <div id="user-pic-name-and-home">
                <img src={this.props.currentUser.profilePicUrl}></img>
                <p className="user-name">
                  <Link to={`/users/${this.props.currentUser.id}`}>
                    {this.props.currentUser.name}
                  </Link>
                </p>
                <p className="home-link">
                  <Link to={`/feed`}>Home</Link>
                </p>
              </div>
              <div id="nav-bar-icons">
                <div id="first-three-icons">
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <i className="fa fa-comments" aria-hidden="true"></i>
                  <i className="fa fa-globe" aria-hidden="true"></i>
                </div>
                <div className='question-icon-and-options'>
                  <i className="fa fa-question" aria-hidden="true" id="question"></i>
                  <i className="fa fa-bars" aria-hidden="true" onClick={this.toggleActionVisibility}></i>
                  {actionsComponent}
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    }
}

export default withRouter(NavBar);
