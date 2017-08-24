import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PostsComponent from './posts_component';
import NavBar from './nav_bar_component';

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
          <NavBar />
          <PostsComponent posts={this.props.posts} users={this.props.users} />
        </div>
      );
    }
  }
}

export default FeedComponent;
