import { connect } from 'react-redux';
import PostsComponent from './posts_component';
import { withRouter } from 'react-router-dom';
import {
  createPost,
  updatePost,
  deletePost,
} from '../../actions/posts_actions';
import { fetchUsers } from '../../actions/user_actions';
import { logout } from '../../actions/session_actions';
import { showModal, hideModal } from '../../actions/modal_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || {},
    users: state.users,
    posts: state.posts,
    errors: state.errors
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    createPost: (post) => dispatch(createPost(post)),
    showModal: (component) => dispatch(showModal(component)),
    hideModal: () => dispatch(hideModal())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostsComponent));
