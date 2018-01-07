import React from 'react';

class ProfPicComponent extends React.Component {
  render() {
    if (!this.props.user) {
      return (
        <p>Loading...</p>
      );
    }
    return (
      <div>
        <div id="profile-photo">
          <img src={this.props.user.profilePic}></img>
          <p className="user-name">
            {this.props.user.name}
          </p>
        </div>
      </div>
    );
  }
}

export default ProfPicComponent;
