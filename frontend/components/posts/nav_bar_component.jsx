import React from 'react';

class NavBar extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="nav-bar">
        <input placeholder="Search"></input>
        <h3 className="nav-bar">Hello, {this.props.currentUser.name}</h3>
      </div>
    )
  }
}

export default NavBar;
