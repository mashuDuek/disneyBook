import React from 'react';
import FriendsComponent from './friends_component';

class ProfileBarComponent extends React.Component {

  constructor(props) {
    super(props);
    this.toggleFriends = this.toggleFriends.bind(this);
    this.state = { showComponentVisibility: false };

  }

  toggleFriends() {
    (e) => e.stopPropagation();
    this.setState({ showComponentVisibility: !this.state.showComponentVisibility });
    this.handleAddFriend = this.handleAddFriend.bind(this);
  }

  handleAddFriend () {
    this.props.createFriendship({ friendship: { friendee_id: this.props.user.id }});
  }

  render() {
    let showComponent;
    if (this.state.showComponentVisibility) {
      showComponent = <FriendsComponent
        users={this.props.users}
        acceptedFriendIds={this.props.acceptedFriendIds}
        pendingFriendIds={this.props.pendingFriendIds}
        hideComponent={this.toggleFriends}
        />
    } else {
      showComponent = null;
    }
    return (
      <div id="profile-bar-component">
        <button onClick={this.props.handleAddFriend}>
          Add Friend
        </button>
        <button onClick={this.toggleFriends}>
          Friends
        </button>
        {showComponent}
      </div>
    )
  }
}

export default ProfileBarComponent;
