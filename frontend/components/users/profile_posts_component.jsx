import React from 'react';
import UserInfoComponent from './user_info_component';
import NewPostContainer from '../posts/new_post_container';
import PostDetailContainer from '../posts/post_detail_container';
import values from 'lodash/values';

class ProfilePostsComponent extends React.Component {

  render() {

    if (!this.props.user) {
      return (
        <p>Loading...</p>
      );
    }

    let posts;
    if (Object.keys(this.props.posts).length < 1) {
      return (<p>Loading posts...</p>);
    } else {
      const postValues = values(this.props.posts);
      posts = postValues.reverse().map((post) => {
        if (post.receiver_id === this.props.user.id) {
          return(
            <PostDetailContainer post={post} key={post.id}/>
          );
        } else {
          return null;
        }
      });
    }

    return (
      <div className="profile-info-and-posts">
        <UserInfoComponent user={this.props.user}/>
        <div className="profile-posts-and-create-post">
          <NewPostContainer user={this.props.user} />
          <ul className="profile-posts">
            {posts}
          </ul>
        </div>
      </div>
    );
  }
}

export default ProfilePostsComponent;
