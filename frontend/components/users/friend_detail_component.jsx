import React from 'react';
import { Link } from 'react-router-dom';

class FriendDetailComponent extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {

    let status;
    if (this.props.status == 'pending') {
      status = (
        <p>Status: Pending</p>
      );
    } else {
      status = null;
    }
    
    return (
      <li id="friend-detail-component" key={this.props.user.id}>
        <img src={this.props.user.profilePicUrl}></img>
        <Link to={`/users/${this.props.user.id}`}>{this.props.user.name}</Link>
        { status }
      </li>
    );
  }
}
export default FriendDetailComponent;
