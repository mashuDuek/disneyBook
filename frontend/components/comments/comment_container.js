import { connect } from 'react-redux';
import CommentComponent from './comment_component';
import { withRouter } from 'react-router-dom';
import {} from '../../actions/comment_actions';

const mapStatetoProps = (state, ownProps) => {
debugger
  return {
    currentUser: state.session.currentUser || {},
    users: state.users,
    posts: state.posts,
    errors: state.errors,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(FeedComponent));
