import React from 'react';
import NavBar from '../posts/nav_bar_component';
import ProfPicComponent from './profile_pic_component';
import UserInfoComponent from './user_info_component';
import ProfilePostsContainer from './profile_posts_container';
import CoverPhotoComponent from './cover_photo_component';
import FriendDetailComponent from './friend_detail_component';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.toggleFriends = this.toggleFriends.bind(this);
    this.state = { showFriends: false };
    this.handleAddFriend = this.handleAddFriend.bind(this);
  }

  handleAddFriend() {
    (e) => e.stopPropagation();
    this.props.createFriendship(
      { friendship:
        { friendee_id: this.props.users[this.props.match.params.userId].id }
      }
    );
  }

  toggleFriends() {
    (e) => e.stopPropagation();
    this.setState({ showFriends: !this.state.showFriends });
  }

  componentDidMount() {
    this.props.fetchUser({ id: this.props.match.params.userId });
  }

  render(){
    if (!this.props.user) {
      return (
        <p>Loading...</p>
      );
    }
    if (this.state.showFriends) {
      const accepted = this.props.acceptedFriendIds.map((user) => {
        return(
          <li key={user.id}>
            <FriendDetailComponent user={user} status="accepted" />
          </li>
        );
      });
      let pending;
      if (this.props.user.id === this.props.currentUser.id) {
        pending = this.props.pendingFriendIds.map((user) => {
          return (
            <FriendDetailComponent user={user} status="pending" />
          );
        });
      } else {
        pending = null;
      }

      return (
        <div>
          <div className="nav-and-profile-pic-components">
            <NavBar
              currentUser={this.props.currentUser}
              logout={this.props.logout}
              />
          </div>
          <div id="cover-and-profile-pics">
            <CoverPhotoComponent user={this.props.user} />
            <ProfPicComponent user={this.props.user} />
              <div id="profile-bar-component">
                <button onClick={this.handleAddFriend}>
                  Add Friend
                </button>
                <button onClick={this.toggleFriends}>
                  Friends
                </button>
              </div>
          </div>
          <div id="all-friends">
            <div id="friends-bar">All of {this.props.user.name}s friends!</div>
            <div id="accepted-pending-friends">
              <ul id="pending">
                {pending}
              </ul>
              <ul id="accepted">
                {accepted}
              </ul>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="profile-page">
          <div className="nav-and-profile-pic-components">
            <NavBar
              currentUser={this.props.currentUser}
              logout={this.props.logout}
              />
          </div>
          <div id="cover-and-profile-pics">
            <CoverPhotoComponent user={this.props.user} />
            <ProfPicComponent user={this.props.user} />
            <div id="profile-bar-component">
              <button onClick={this.handleAddFriend}>
                Add Friend
              </button>
              <button onClick={this.toggleFriends}>
                Friends
              </button>
            </div>
          </div>
          <ProfilePostsContainer user={this.props.user} />
        </div>
      );
    }
  }
}

export default ProfileComponent;
