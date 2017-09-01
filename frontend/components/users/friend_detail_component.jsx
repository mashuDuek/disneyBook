import React from 'react';

class FriendDetailComponent extends React.Component {

  constructor (props) {
    super(props)
  }

  render() {

    return (
      <li id="friend-detail-component">
        <img src={this.props.user.profilePicUrl}></img>
        <p>{this.props.user.name}</p>
        <p>Status: {this.props.status}</p>
      </li>
    );
  }
}
export default FriendDetailComponent;
