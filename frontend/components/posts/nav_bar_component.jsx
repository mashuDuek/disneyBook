import React from 'react';

class NavBar extends React.Component {
    constructor (props) {
      super(props);
    }

    render() {
      return (
        <h3 className="nav-bar">I will become the nav bar at the top</h3>
      )
    }
}

export default NavBar;