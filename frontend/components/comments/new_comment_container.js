import { connect } from 'react-redux';
import NewCommentComponent from './new_comment_component';
import { withRouter } from 'react-router-dom';
import { createComment } from '../../actions/comment_actions';
import { fetchPost } from '../../actions/posts_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: ownProps.currentUser,
    errors: state.errors,
    post: ownProps.post
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {

  return {
    createComment: (comment) => (dispatch(createComment(comment))),
    fetchPost: (post) => (dispatch(fetchPost(post))),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(NewCommentComponent));
