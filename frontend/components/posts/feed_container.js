import { connect } from 'react-redux';
import FeedComponent from './feed_component';
import { withRouter } from 'react-router-dom';
import { fetchAllPosts } from '../../actions/posts_actions';
import { fetchUsers } from '../../actions/user_actions';


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAllPosts: () => dispatch(fetchAllPosts()),
    fetchUsers: () => dispatch(fetchUsers())
  };
};

export default withRouter(connect(
  null,
  mapDispatchToProps
)(FeedComponent));
