import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PostsComponent from './posts_component';
import NavBarContainer from '../nav_bar/nav_bar_container';

class FeedComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchAllPosts();
    this.props.fetchUsers();
  }

  render() {
    return (
      <NavBarContainer/>
    );
  }
}

export default FeedComponent;
