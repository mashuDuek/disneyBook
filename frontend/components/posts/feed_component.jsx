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
    // this.props.fetchUsers();
  }

  render() {
      return (
        <NavBar
          currentUser={this.props.currentUser}
          logout={this.props.logout}
          />
      );
  }
}

export default FeedComponent;
