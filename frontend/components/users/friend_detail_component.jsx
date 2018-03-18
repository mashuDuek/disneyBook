import React from 'react';
import { Link } from 'react-router-dom';

class FriendDetailComponent extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <li id="friend-detail-component">
        <img src={this.props.user.profilePic}></img>
        <div className="friend-info">
          <Link
            onClick={this.props.toggleFriends}
            to={`/users/${this.props.user.id}`}
            >
            {this.props.user.name}
          </Link>
          <p>{this.props.user.movie}</p>
        </div>
      </li>
    );
  }
}
export default FriendDetailComponent;
