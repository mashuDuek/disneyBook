import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

class PendingReqs extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hello: 'hello' };
    this.acceptFriend = this.acceptFriend.bind(this);
  }

  acceptFriend (e, user) {
    e.preventDefault();
    this.props.acceptFriendship(user);
  }

  render() {
    let pendingFriends;
    let requestCount;
    if (!this.props.pendingFriends) {
      pendingFriends = null;
      requestCount = 0;
    } else {
      requestCount = this.props.pendingFriends.length;
      pendingFriends = this.props.pendingFriends.map( (requester) => {
        return (
          <li key={requester.id}>
            <img src={requester.profilePicUrl}></img>
            <Link to={`/users/${requester.id}`}
              onClick={this.props.hideDropdown}>
              <p>{requester.name} from {requester.movie}</p>
            </Link>
            <button onClick={(e) => this.acceptFriend(e, requester)}>Accept</button>
          </li>
        );
      });
    }

    return (
      <div>
        <ul id="pending-friends">
          <p className="pending-p-tag">You have {requestCount} pending requests!</p>
          {pendingFriends}
        </ul>
      </div>
    );
  }
}

export default PendingReqs;
