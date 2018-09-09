import React from 'react';

class NavBarActionComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.logout();
    this.props.hideDropdown();
    this.props.history.push('/');
  }

  render() {
    return(
      <div id='nav-bar-actions'>
        <ul>
          <li>
            <button onClick={this.handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    );
  }
}


export default NavBarActionComponent;
