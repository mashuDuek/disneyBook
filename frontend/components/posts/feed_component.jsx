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
    return(
      <PostsComponent body={this.props.body}/>
    );
  }
}

export default FeedComponent;
