import React from 'react';

class NavBar extends React.Component {
    constructor (props) {
      super(props);
    }

    render() {
      return (
        <h3 className="nav-bar">Hello, {this.props.currentUser.name}</h3>
      )
    }
}

export default NavBar;
