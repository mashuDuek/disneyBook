import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PostsComponent from './posts_component';

class FeedComponent extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.props.fetchAllPosts();
  }

  render() {
    if (!this.props.posts[0]) {
      return (
        <p>loading...</p>
      );
    } else {
      return (
        <PostsComponent posts={this.props.posts} />
      );
    }
  }
}

export default FeedComponent;
