import { Link, Redirect, withRouter } from 'react-router-dom';
import React from 'react';
import values from 'lodash/values';
import NewPostComponent from './new_post_component';
import PostDetailComponent from './post_detail_component';
import PostDetailContainer from './post_detail_container';
import LeftInfoComponent from './left_info_component';
import RightInfoComponent from './right_info_component';

class PostsComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let posts;
    if (Object.keys(this.props.posts).length < 1) {
      return (<p>Loading posts...</p>)
    } else {
      const postValues = values(this.props.posts)
      posts = postValues.reverse().map((post) => {
        if (!post) {
          return null;
        } else {
          return( <PostDetailContainer post={post} /> );
        }
      });
    };

    return(
    <div className="posts-and-info-components">
      <LeftInfoComponent />
      <div className="create-post-all-posts">
        <NewPostComponent
          create={this.props.createPost}
          currentUser={this.props.currentUser}
          receiverId={this.props.receiverId}
          />
        <ul className="all-posts-ul">
          {posts}
        </ul>
      </div>
      <RightInfoComponent />
    </div>
    );
  }
}

export default PostsComponent;
