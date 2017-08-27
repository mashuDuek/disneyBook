import { connect } from 'react-redux';
import PostDetailComponent from './post_detail_component';
import { withRouter } from 'react-router-dom';
import { createPost, updatePost, deletePost } from '../../actions/posts_actions';
import { showModal, hideModal } from '../../actions/modal_actions';

const mapStatetoProps = (state, ownProps) => {
  
  // debugger
  return {
    currentUser: state.session.currentUser || {},
    users: state.users,
    post: ownProps.post
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    showModal: (component) => dispatch(showModal(component)),
    hideModal: () => dispatch(hideModal())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostDetailComponent));
