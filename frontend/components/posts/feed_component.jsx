import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PostsComponent from './posts_component';
import NavBar from './nav_bar_component';
import LeftInfoComponent from './left_info_component';
import RightInfoComponent from './right_info_component';

class FeedComponent extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.props.fetchAllPosts();
    this.props.fetchUsers();
  }

  render() {
    if (!this.props.posts[0]) {
      return (
        <p>loading...</p>
      );
    } else {
      return (
        <div className="feed-page">
          <header>
            <NavBar />
          </header>
          <div className="posts-and-info-components">
            <LeftInfoComponent />
            <PostsComponent
              posts={this.props.posts}
              users={this.props.users}
              createPost={this.props.createPost}
              updatePost={this.props.updatePost}
              deletePost={this.props.deletePost}
              currentUser={this.props.currentUser}
              />
            <RightInfoComponent />
          </div>
        </div>
      );
    }
  }
}

export default FeedComponent;
