import React from 'react';
import NavBar from '../posts/nav_bar_component';
import ProfPicComponent from './profile_pic_component';
import UserInfoComponent from './user_info_component';
import ProfilePostsComponent from './profile_posts_component';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    debugger
    const user = this.props.users[this.props.match.params.userId];
    return (
      <div id="profile-page">
        <div className="nav-and-profile-pic-components">
          <NavBar
            currentUser={this.props.currentUser}
            logout={this.props.logout}
            />
          <ProfPicComponent
            user={user}
            />
        </div>
          <ProfilePostsComponent />
      </div>

    );
  }
}

export default ProfileComponent;
