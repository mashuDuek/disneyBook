import React from 'react';
import UserInfoComponent from './user_info_component';
import NewPostComponent from '../posts/new_post_component';

class ProfilePostsComponent extends React.Component {

  render() {
    debugger
    return (
      <div>
        <UserInfoComponent user={this.props.user}/>
        <div>
          <NewPostComponent currentUser={this.props.currentUser}/>

        </div>
      </div>
    );
  }
}

export default ProfilePostsComponent;
