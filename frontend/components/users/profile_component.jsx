import React from 'react';
import NavBar from '../nav_bar/nav_bar_component';
import ProfilePhoto from '../images/profile_photo';
import ProfilePosts from './profile_posts';
import CoverPhoto from '../images/cover_photo';
import FriendDetailComponent from './friend_detail_component';
import ProfPicComponent from '../images/profile_pic_component';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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

  componentDidMount() {
    this.props.fetchUser({ id: this.props.match.params.userId }).then(() => {
      this.props.fetchAllComments();
    });
  }

  render(){
    if (!this.props.user) return <p>Loading...</p>;

    const drops = this.props.dropdowns;
    let dropdownAction;
    if (Boolean(drops.displayed) || Boolean(drops.component)) {
      dropdownAction = this.props.hideDropdown;
    } else {
      dropdownAction = (e) => e.stopPropagation();
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
            <NavBar/>
          </div>
          <div id="cover-and-profile-pics">
            <CoverPhoto
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
            <CoverPhoto
              currentUser={ this.props.currentUser }
              user={ this.props.user }
              showModal={ this.props.showModal }
              updateCover={ this.props.updateCover }
              />
            <ProfilePhoto
              currentUser={ this.props.currentUser }
              user={ this.props.user }
              showModal={ this.props.showModal }
              updateCover={ this.props.updateCover }
              />
            <div id="profile-bar-component">
              <button onClick={ this.handleAddFriend }>
                Add Friend
              </button>
              <button onClick={ this.toggleFriends }>
                { buttonText }
              </button>
            </div>
          </div>
          <ProfilePosts user={ this.props.user } />
        </div>
      );
    }
  }
}

const mapStatetoProps = (state, ownProps) => {
  let acceptedFriends;
  if (!state.session.currentUserProfile) {
    acceptedFriends = null;
  } else {
    acceptedFriends = state.session.currentUserProfile.acceptedFriends;
  }

  return {
    acceptedFriends,
    user: state.entities.users[ownProps.match.params.userId],
    currentUser: state.session.currentUser || {},
    dropdowns: state.ui.dropdowns,
    users: state.entities.users,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideDropdown: () => dispatch(hideDropdown()),
    fetchUser: (user) => dispatch(fetchUser(user)),
    createFriendship: (user) => dispatch(createFriendship(user)),
    showModal: (component) => dispatch(showModal(component)),
    updateCover: (image) => dispatch(updateCoverPic(image)),
    fetchAllComments: () => dispatch(fetchAllComments())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfileComponent));
