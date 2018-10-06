import { Link, Redirect, withRouter } from 'react-router-dom';
import React from 'react';
import values from 'lodash/values';
import NewPostContainer from './new_post_container';
import PostDetailComponent from './post_detail_component';
import PostDetailContainer from './post_detail_container';
import LeftInfoComponent from './left_info_component';
import RightInfoComponent from './right_info_component';

class PostsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  handleDropdown () {
    if (this.props.dropdownOpen) {
      this.props.hideDropdown();
    }
  }

  componentDidMount () {
    this.props.fetchAllPosts();
    this.props.fetchAllComments();
  }

  render() {
    if (Object.keys(this.props.posts).length < 1) return <p>Loading posts...</p>;

    const friendIds = this.props.currentUser.acceptedFriends;
    const posts = Object.values(this.props.posts).map(post => {
      if (
        friendIds.includes(post.author_id) ||
        post.author_id === this.props.currentUser.id ||
        post.receiver_id === this.props.currentUser.id
      ) {
        return (
          <li key={ post.id } className='individual-post'>
            <PostDetailContainer post={ post } />
          </li>
        );
      } else {
        return null;
      }
    });

    return (
      <div className="posts-and-info-components" onClick={this.handleDropdown}>
        <LeftInfoComponent />
        <div className="create-post-all-posts">
          <NewPostContainer />
          <ul className="all-posts-ul">
            { posts }
          </ul>
        </div>
        <RightInfoComponent />
      </div>
    );
  }
}

export default PostsComponent;
