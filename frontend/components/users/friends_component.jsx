import React from 'react';
import FriendDetailComponent from './friend_detail_component';

class FriendsComponent extends React.Component {
  constructor(props) {
    super(props);
  }


  render () {
    const accepted = this.props.acceptedFriendIds.map((user) => {
      return <FriendDetailComponent user={this.props.users[user.id]} status="accepted" />
    });
    const pending = this.props.pendingFriendIds.map((user) => {
      return <FriendDetailComponent user={this.props.users[user.id]} status="pending" />
    });

    return (
      <div id="all-friends">
        <button onClick={this.props.toggleFriends}>X</button>
        <div id="accepted-pending-friends">  
          <ul id="accepted">
            {accepted}
          </ul>
          <ul id="pending">
            {pending}
          </ul>
        </div>
      </div>
    );
  }
}

export default FriendsComponent;
