import React from 'react';
import { Link } from 'react-router-dom';

class FriendDetailComponent extends React.Component {

  constructor (props) {
    super(props)
  }

  render() {
debugger
    return (
      <li id="friend-detail-component">
        <img src={this.props.user.profilePicUrl}></img>
        <Link to={`/users/${this.props.user.id}`}>{this.props.user.name}</Link>
        <p>Status: {this.props.status}</p>
      </li>
    );
  }
}
export default FriendDetailComponent;
