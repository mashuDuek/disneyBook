import { connect } from 'react-redux';
import NewCommentComponent from './new_comment_component';
import { withRouter } from 'react-router-dom';
import { createComment } from '../../actions/comment_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: ownProps.currentUser,
    errors: state.errors,
    postId: ownProps.postId
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createComment: (comment) => (dispatch(createComment(comment))),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(NewCommentComponent));
