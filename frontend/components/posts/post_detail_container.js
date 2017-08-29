import { connect } from 'react-redux';
import PostDetailComponent from './post_detail_component';
import { withRouter } from 'react-router-dom';
import { createPost, updatePost, deletePost } from '../../actions/posts_actions';
import { showModal, hideModal } from '../../actions/modal_actions';
import { fetchPost, fetchAllPosts } from '../../actions/posts_actions';

const mapStatetoProps = (state, ownProps) => {
debugger
  return {
    comments: state.comments,
    currentUser: state.session.currentUser || {},
    users: state.users,
    post: ownProps.post,
    posts: state.posts
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    showModal: (component) => dispatch(showModal(component)),
    fetchPost: (post) => dispatch(fetchPost(post)),
    fetchPosts: (posts) => dispatch(fetchPosts(posts)),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostDetailComponent));
