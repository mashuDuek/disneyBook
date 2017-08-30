import React from 'react';

class UserInfoComponent extends React.Component {

  render () {
    
    return (
      <h1>
        {this.props.user.name}
        <p>I acted in: {this.props.user.movie}</p>
        <p>For future gigs: {this.props.user.email}</p>
      </h1>
    );
  }
}

export default UserInfoComponent;
