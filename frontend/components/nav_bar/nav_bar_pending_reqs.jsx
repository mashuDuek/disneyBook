import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { hideDropdown } from '../../actions/dropdown_actions';
import { acceptFriendship } from '../../actions/friendship_actions';


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
    const pendingIds = this.props.pendingFriendIds;
    let pendingFriends;
    let requestCount;
    if (!pendingIds) {
      pendingFriends = null;
      requestCount = 0;
    } else {
      requestCount = pendingIds.length;
      pendingFriends = pendingIds.map(id => {
        const requester = this.props.users[parseInt(id)];
        return (
          <li key={requester.id}>
            <img src={requester.profilePic}></img>
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

const mapStatetoProps = (state, ownProps) => {
  const currentUser = state.entities.users[state.session.currentUser.id];
  return {
    pendingFriendIds: currentUser.pendingFriendIds,
    users: state.entities.users
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideDropdown: () => dispatch(hideDropdown()),
    acceptFriendship: (user) => dispatch(acceptFriendship(user))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PendingReqs));
