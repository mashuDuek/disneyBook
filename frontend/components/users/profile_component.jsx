import React from 'react';
import NavBar from '../posts/nav_bar_component';
import ProfPicComponent from './profile_pic_component';
import UserInfoComponent from './user_info_component';
import ProfilePostsContainer from './profile_posts_container';
import CoverPhotoComponent from './cover_photo_component';
import ProfileBarContainer from './profile_bar_container';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUser({id: this.props.match.params.userId});
  }

  render(){
    if (!this.props.user) {
      return (
        <p>Loading...</p>
      )
    }

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
          <ProfileBarContainer />
        </div>
        <ProfilePostsContainer user={this.props.user} />
      </div>
    );
  }
}

export default ProfileComponent;
