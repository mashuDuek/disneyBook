import { connect } from 'react-redux';
import NewCommentComponent from './new_comment_component';
import { withRouter } from 'react-router-dom';
import { createComment } from '../../actions/comment_actions';

const mapStatetoProps = (state, ownProps) => {
  debugger
  return {
    currentUser: ownProps.currentUser,
    errors: state.errors,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  debugger
  return {
    createComment: (comment) => (dispatch(createComment(comment))),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(NewCommentComponent));
