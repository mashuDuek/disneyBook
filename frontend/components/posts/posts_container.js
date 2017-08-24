import { connect } from 'react-redux';
import FeedComponent from './feed_component';
import { withRouter } from 'react-router-dom';
import {
  createPost,
  updatePost,
  deletePost,
  fetchAllPosts
} from '../../actions/posts_actions';
import { fetchUsers } from '../../actions/user_actions';


const mapStatetoProps = (state, ownProps) => {

  return {
    users: state.users,
    posts: state.posts,
    errors: state.posts.errors,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {

  
  return {
    fetchUsers: () => dispatch(fetchUsers()),
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(update(post)),
    fetchAllPosts: () => dispatch(fetchAllPosts()),
    createPost: (post) => dispatch(createPost(post))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(FeedComponent));
