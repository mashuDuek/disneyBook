import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NavBar from '../nav_bar/nav_bar_component';
import ProfilePhoto from '../images/profile_photo';
import ProfilePosts from './profile_posts';
import CoverPhoto from '../images/cover_photo';
import FriendDetailComponent from './friend_detail_component';
import ProfPicComponent from '../images/profile_pic_component';

import { fetchUser } from '../../actions/user_actions';
import { fetchAllComments } from '../../actions/comment_actions';
import { createFriendship } from '../../actions/friendship_actions';
import { hideDropdown } from '../../actions/dropdown_actions';
import { showModal } from '../../actions/modal_actions';
import { updateCoverPic } from '../../actions/image_actions';

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

  componentDidUpdate(oldProps) {
    if (oldProps.match.params.userId !== this.props.match.params.userId) {
      this.setState({ showFriends: false }, () => {
        this.props.fetchUser(this.props.match.params.userId);
      });
    }
  }

  componentDidMount() {
    this.props.fetchUser(this.props.match.params.userId).then(() => {
      this.props.fetchAllComments();
    });
  }

  renderFriends(ids) {
    return ids.map((id) => (
      <li key={id}>
        <FriendDetailComponent
          user={this.props.users[id]}
          status="accepted"
          toggleFriends={this.toggleFriends}
        />
      </li>
    ));
  }

  renderFriendsList(friends) {
    const { 
      user, 
      showModal, 
      currentUser, 
      updateCover,
      dropdownAction
    } = this.props;

    return (
      <div onClick={dropdownAction}>
        <div className="nav-and-profile-pic-components">
          <NavBar />
        </div>
        <div id="cover-and-profile-pics">
          <CoverPhoto
            currentUser={currentUser}
            user={user}
            showModal={showModal}
            updateCover={updateCover}
          />
          <ProfPicComponent user={user} />
          <div id="profile-bar-component">
            <button 
              disabled={user.currentUserIsFriend} 
              onClick={this.handleAddFriend}>Add Friend
            </button>
            <button onClick={this.toggleFriends}>
              {`${user.name}s Profile`}
            </button>
          </div>
        </div>
        <div id="all-friends">
          <div id="friends-bar">All of {user.name}s friends!</div>
          <div id="accepted-pending-friends">
            <ul id="accepted">
              {friends}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  render(){
    const { 
      hideDropdown, 
      dropdowns, 
      user, 
      acceptedFriendIds, 
      currentUser,
      showModal,
      updateCover
    } = this.props;

    if (!user) return <p>Loading...</p>;

    let dropdownAction;
    if (Boolean(dropdowns.displayed) || Boolean(dropdowns.component)) {
      dropdownAction = hideDropdown;
    } else {
      dropdownAction = (e) => e.stopPropagation();
    }

    if (this.state.showFriends) {
      let friends = this.renderFriends(acceptedFriendIds);
      if (!acceptedFriendIds) {
        friends = `${user.name} has no friends yet!`;
      }

      return this.renderFriendsList(friends);

    } else {

      return (
        <div id="profile-page" onClick={dropdownAction}>
          <div id="cover-and-profile-pics">
            <CoverPhoto
              currentUser={currentUser}
              user={user}
              showModal={showModal}
              updateCover={updateCover}
              />
            <ProfilePhoto
              currentUser={currentUser}
              user={user}
              showModal={showModal}
              updateCover={updateCover}
              />
            <div id="profile-bar-component">
              <button 
                onClick={this.handleAddFriend} 
                disabled={user.currentUserIsFriend}>
                Add Friend
              </button>
              <button onClick={this.toggleFriends}>
                {`${user.name}'s Friends`}
              </button>
            </div>
          </div>
          <ProfilePosts user={user} />
        </div>
      );
    }
  }
}

const mapStatetoProps = (state, ownProps) => {
  const user = state.entities.users[ownProps.match.params.userId];
  const acceptedFriendIds = user ? user.acceptedFriendIds : [];
  return {
    user,
    acceptedFriendIds,
    currentUser: state.session.currentUser || {},
    dropdowns: state.ui.dropdowns,
    users: state.entities.users,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: id => dispatch(fetchUser(id)),
    showModal: component => dispatch(showModal(component)),
    updateCover: image => dispatch(updateCoverPic(image)),
    hideDropdown: () => dispatch(hideDropdown()),
    createFriendship: user => dispatch(createFriendship(user)),
    fetchAllComments: () => dispatch(fetchAllComments())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfileComponent));
