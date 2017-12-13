import { connect } from 'react-redux';
import NewPostComponent from './new_post_component';
import { withRouter } from 'react-router-dom';
import { createPost } from '../../actions/posts_actions';

const mapStatetoProps = (state, ownProps) => {

  return {
    currentUser: state.session.currentUser || {},
    user: ownProps.user,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    create: (post) => dispatch(createPost(post))
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(NewPostComponent));
