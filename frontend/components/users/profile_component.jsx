import React from 'react';
import NavBar from '../posts/nav_bar_component';
import ProfPicComponent from './profile_pic_component';
import UserInfoComponent from './user_info_component';
import ProfilePostsContainer from './profile_posts_container';

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    if (Object.keys(this.props.users).length < 1) {
      return (<p>Loading...</p>);
    }
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
          <ProfilePostsContainer user={user}/>
      </div>

    );
  }
}

export default ProfileComponent;
