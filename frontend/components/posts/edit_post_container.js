import { connect } from 'react-redux';
import EditPost from './edit_post';
import { withRouter } from 'react-router-dom';
import { updatePost } from '../../actions/posts_actions';
import { hideModal } from '../../actions/modal_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    post: ownProps.post
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePost: (post) => dispatch(updatePost(post)),
    hideModal: () => dispatch(hideModal())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(EditPost));
