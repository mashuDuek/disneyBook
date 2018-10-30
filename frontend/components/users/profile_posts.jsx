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
    const { props } = this;
    if (!props.user) return <p>Loading...</p>;
    if (Object.keys(props.posts).length < 1) return <p>Loading...</p>;

    const postValues = values(props.posts).filter((post) => {
      return post.receiver_id === props.user.id ||
        post.author_id === props.user.id;
    });

    const posts = postValues.reverse().map((post) => (
      <PostDetailComponent post={ post } key={ post.id }/>
    ));

    return (
      <div className="profile-info-and-posts">
        <UserInfoComponent user={ props.user }/>
        <div className="profile-posts-and-create-post">
          <NewPostComponent user={ props.user } />
          <ul className="profile-posts">
            { posts }
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
