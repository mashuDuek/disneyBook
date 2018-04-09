import { connect } from 'react-redux';
import PostDetailComponent from './post_detail_component';
import { withRouter } from 'react-router-dom';
import { createPost, updatePost, deletePost } from '../../actions/posts_actions';
import { showModal, hideModal } from '../../actions/modal_actions';
import { receivePosts, fetchAllPosts } from '../../actions/posts_actions';
import { fetchAllComments } from '../../actions/comment_actions';
import { showDropdown, displayDropdown } from '../../actions/dropdown_actions';
import { fetchUser, fetchUsers } from '../../actions/user_actions';
import { createLike, deleteLike } from '../../actions/like_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    dropdownVisible: state.ui.dropdowns.displayed === ownProps.post.id,
    currentUser: state.session.currentUser || {},
    comments: state.entities.comments,
    posts: state.entities.posts,
    users: state.entities.users,
    like: state.entities.likes,
    post: ownProps.post,
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
    fetchUser: (user) => dispatch(fetchUser(user)),
    createLike: (like) => dispatch(createLike(like)),
    deleteLike: (like) => dispatch(deleteLike(like)),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostDetailComponent));
