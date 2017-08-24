import { Link, Redirect, withRouter } from 'react-router-dom';
import React from 'react';
import values from 'lodash/values';
import NewPostComponent from './new_post_component';
import PostDetailComponent from './post_detail_component';

class PostsComponent extends React.Component {
  constructor(props) {
    super(props);
  }

// eventually, will need to add link to
// author profile page, so Ill bring up list of
// friends of currentUser to this state ??
// need friendships table now
// need user up at the feed page
  render() {
    const posts = values(this.props.posts).map((post) => {
      return(
        <PostDetailComponent
          key={post.id}
          post={post}
          users={this.props.users}
          delete={this.props.deletePost}
          />
      );
    });

    return(
      <div className="create-post-all-posts">
        <NewPostComponent
          create={this.props.createPost}
          currentUser={this.props.currentUser}
          />
        <ul className="all-posts-ul">
          <h4> the list beneath me will be users friends feed</h4>
          {posts}
        </ul>
      </div>
    );
  }
}

export default PostsComponent;
