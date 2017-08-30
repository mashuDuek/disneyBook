import React from 'react';

class ProfPicComponent extends React.Component {
  render() {
    return (
      <div>
        <div id="profile-photo">
          <img src={this.props.user.profilePicUrl}></img>
        </div>
        <p className="user-name">
          {this.props.user.name}
        </p>
      </div>
    );
  }
}

export default ProfPicComponent;
