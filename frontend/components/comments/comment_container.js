import { connect } from 'react-redux';
import CommentComponent from './comment_component';
import { withRouter } from 'react-router-dom';
import { createComment,
  updateComment,
  deleteComment
} from '../../actions/comment_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || {},
    comment: ownProps.comment,
    users: state.users,
    posts: state.posts,
    errors: state.errors,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createComment: (comment) => (dispatch(createComment(comment))),
    updateComment: (comment) => (dispatch(updateComment(comment))),
    deleteComment: () => (dispatch(deleteComment())),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(CommentComponent));
