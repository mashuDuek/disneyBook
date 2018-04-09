import ProfilePostsComponent from './profile_posts_component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  createPost,
  updatePost,
  deletePost,
  fetchAllPosts
} from '../../actions/posts_actions';
import { fetchUsers, fetchUser } from '../../actions/user_actions';
import { logout } from '../../actions/session_actions';
import { showModal, hideModal } from '../../actions/modal_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || {},
    users: state.entities.users,
    posts: state.entities.posts,
    errors: state.ui.errors,
    user: ownProps.user,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    fetchAllPosts: () => dispatch(fetchAllPosts()),
    createPost: (post) => dispatch(createPost(post)),
    logout: () => dispatch(logout()),
    showModal: (component) => dispatch(showModal(component)),
    hideModal: () => dispatch(hideModal()),
  };
};
export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(ProfilePostsComponent));
