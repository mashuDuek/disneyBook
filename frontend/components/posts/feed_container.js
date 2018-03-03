import { connect } from 'react-redux';
import FeedComponent from './feed_component';
import { withRouter } from 'react-router-dom';
import { fetchAllPosts } from '../../actions/posts_actions';


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAllPosts: () => dispatch(fetchAllPosts())
  };
};

export default withRouter(connect(
  null,
  mapDispatchToProps
)(FeedComponent));
