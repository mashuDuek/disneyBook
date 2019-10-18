import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import values from 'lodash/values';

import UserInfoComponent from './user_info_component';
import NewPostComponent from '../posts/new_post_component';
import PostDetailComponent from '../posts/post_detail_component';
import { fetchAllPosts } from '../../actions/posts_actions';

class ProfilePosts extends React.Component {

  componentDidMount () {
    this.props.fetchAllPosts();
  }

  render() {
    const { user, posts } = this.props;

    if (!user) return <p>Loading...</p>;

    let postsToRender = <p>No posts yet. Try writing something :)</p>;
    if (Object.keys(posts).length > 0) {
      const postValues = values(posts).filter(post => (
        post.receiver_id === user.id || post.author_id === user.id 
      ))
  
      postsToRender = postValues.reverse().map((post) => (
        <PostDetailComponent post={ post } key={ post.id }/>
      ));
    } 


    return (
      <div className="profile-info-and-posts">
        <UserInfoComponent user={ user }/>
        <div className="profile-posts-and-create-post">
          <NewPostComponent user={ user } />
          <ul className="profile-posts">
            { postsToRender }
          </ul>
        </div>
      </div>
    );
  }
}

const mapStatetoProps = (state, ownProps) => {
  return {
    posts: state.entities.posts,
    user: ownProps.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllPosts: () => dispatch(fetchAllPosts()),
  };
};
export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfilePosts));
