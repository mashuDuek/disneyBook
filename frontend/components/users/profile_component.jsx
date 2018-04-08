import React from 'react';
import NavBarContainer from '../nav_bar/nav_bar_container';
import ProfPicComponent from '../images/profile_pic_component';
import UserInfoComponent from './user_info_component';
import ProfilePostsContainer from './profile_posts_container';
import CoverPhotoContainer from '../images/cover_photo_container';
import FriendDetailComponent from './friend_detail_component';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showFriends: false };
    this.toggleFriends = this.toggleFriends.bind(this);
    this.handleAddFriend = this.handleAddFriend.bind(this);
  }

  handleAddFriend(e) {
    e.stopPropagation();
    this.props.createFriendship(
      { friendship:
        { friendee_id: this.props.users[this.props.match.params.userId].id }
      }
    );
  }

  toggleFriends(e) {
    e.stopPropagation();
    this.setState({ showFriends: !this.state.showFriends });
  }

  componentDidMount() {
    this.props.fetchUser({ id: this.props.match.params.userId });
    this.props.fetchAllComments();
  }

  render(){
    const drops = this.props.dropdowns;
    let dropdownAction;
    if (Boolean(drops.displayed) || Boolean(drops.component)) {
      dropdownAction = this.props.hideDropdown;
    } else {
      dropdownAction = (e) => e.stopPropagation();
    }

    if (!this.props.user) {
      return (
        <p>Loading...</p>
      );
    }

    let buttonText;
    if (this.state.showFriends) {
      buttonText = 'Back to Profile';
      let accepted;
      if (!this.props.acceptedFriends) {
        accepted = `${this.props.user.name} has no friends yet!`;
      } else {
        const friendIds = Object.keys(this.props.acceptedFriends);
        accepted = friendIds.map((id) => {
          const user = this.props.acceptedFriends[id];
          return(
            <li key={ user.id }>
              <FriendDetailComponent
                user={ user }
                status="accepted"
                toggleFriends={ this.toggleFriends }
                />
            </li>
          );
        });
      }

      return (
        <div onClick={ dropdownAction }>
          <div className="nav-and-profile-pic-components">
            <NavBarContainer/>
          </div>
          <div id="cover-and-profile-pics">
            <CoverPhotoContainer
              currentUser={ this.props.currentUser }
              user={ this.props.user }
              showModal={ this.props.showModal }
              updateCover={ this.props.updateCover }
              />
            <ProfPicComponent user={ this.props.user } />
              <div id="profile-bar-component">
                <button onClick={ this.handleAddFriend }>
                  Add Friend
                </button>
                <button onClick={ this.toggleFriends }>
                  { buttonText }
                </button>
              </div>
          </div>
          <div id="all-friends">
            <div id="friends-bar">All of { this.props.user.name }s friends!</div>
            <div id="accepted-pending-friends">
              <ul id="accepted">
                { accepted }
              </ul>
            </div>
          </div>
        </div>
      );

    } else {

      buttonText = `${this.props.user.name}'s Friends'`;

      return (
        <div id="profile-page" onClick={ dropdownAction }>
          <div id="cover-and-profile-pics">
            <CoverPhotoContainer
              currentUser={ this.props.currentUser }
              user={ this.props.user }
              showModal={ this.props.showModal }
              updateCover={ this.props.updateCover }
              />
            <ProfPicComponent user={ this.props.user } />
            <div id="profile-bar-component">
              <button onClick={ this.handleAddFriend }>
                Add Friend
              </button>
              <button onClick={ this.toggleFriends }>
                { buttonText }
              </button>
            </div>
          </div>
          <ProfilePostsContainer user={ this.props.user } />
        </div>
      );
    }
  }
}

export default ProfileComponent;
