import React from 'react';

class ProfPicComponent extends React.Component {
  render() {
    debugger
    return (
      <div>
        <img src={this.props.user.profilePicUrl}></img>
        <p className="user-name">
          {this.props.user.name}
        </p>
      </div>
    );
  }
}

export default ProfPicComponent;
