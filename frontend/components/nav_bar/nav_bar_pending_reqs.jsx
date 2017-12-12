import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

class PendingReqs extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hello: 'hello' };
  }

  render() {
    let pendingFriends;
    let requestCount;
    if (!this.props.pendingFriends) {
      pendingFriends = null;
      requestCount = 0;
    } else {
      // here, i need to include buttons to delete and accept requests.
      // have to make both of those actions to dispatch on click of those buttons
      requestCount = this.props.pendingFriends.length;
      pendingFriends = this.props.pendingFriends.map( (requester) => {
        return (
          <li key={requester.id}>
            <img src={requester.profilePicUrl}></img>
            <Link to={`/users/${requester.id}`}
              onClick={this.props.hideDropdown}>
              <p>{requester.name} from {requester.movie}</p>
            </Link>
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
