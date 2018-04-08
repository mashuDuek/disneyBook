import { connect } from 'react-redux';
import PostDetailComponent from './post_detail_component';
import { withRouter } from 'react-router-dom';
import { createPost, updatePost, deletePost } from '../../actions/posts_actions';
import { showModal, hideModal } from '../../actions/modal_actions';
import { receivePosts, fetchAllPosts } from '../../actions/posts_actions';
import { fetchAllComments } from '../../actions/comment_actions';
import { showDropdown, displayDropdown } from '../../actions/dropdown_actions';
import { fetchUser, fetchUsers } from '../../actions/user_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    comments: state.comments,
    currentUser: state.session.currentUser || {},
    users: state.users,
    post: ownProps.post,
    posts: state.posts,
    dropdownVisible: state.dropdowns.displayed === ownProps.post.id
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    showModal: (component) => dispatch(showModal(component)),
    receivePosts: (post) => dispatch(receivePosts(post)),
    fetchPosts: (posts) => dispatch(fetchPosts(posts)),
    showDropdown: (component) => dispatch(showDropdown(component)),
    displayDropdown: (component) => dispatch(displayDropdown(component)),
    fetchComments: () => dispatch(fetchAllComments()),
    fetchUsers: () => dispatch(fetchUsers()),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostDetailComponent));
