import { connect } from 'react-redux';
import PostActionComponent from './post_action_component';
import { withRouter } from 'react-router-dom';
import { updatePost, deletePost } from '../../actions/posts_actions';
import { showModal, hideModal } from '../../actions/modal_actions';
import { showDropdown } from '../../actions/dropdown_actions';


const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || {},
    post: ownProps.post,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideModal: () => dispatch(hideModal()),
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    showModal: (component) => dispatch(showModal(component)),
    showDropdown: (component) => dispatch(showDropdown(component)),
    toggleActionVisibility: () => ownProps.toggleActionVisibility(),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostActionComponent));
