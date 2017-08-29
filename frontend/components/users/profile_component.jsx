import React from 'react';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        <h1>
          Hello, {this.props.currentUser.name}!
        </h1>
      </div>
    );
  }
}

export default ProfileComponent;
