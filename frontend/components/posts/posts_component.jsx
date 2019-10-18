import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import React from 'react';
import NewPostComponent from './new_post_component';
import PostDetailComponent from './post_detail_component';
import LeftInfoComponent from './left_info_component';
import RightInfoComponent from './right_info_component';
import { fetchAllComments } from '../../actions/comment_actions';
import { fetchAllPosts } from '../../actions/posts_actions';
import { hideDropdown } from '../../actions/dropdown_actions';

class PostsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  handleDropdown () {
    if (this.props.dropdownOpen) {
      this.props.hideDropdown();
    }
  }

  componentDidMount () {
    this.props.fetchAllPosts().then(this.props.fetchAllComments);
    // this.props.fetchAllComments();
  }

  render() {
    const { posts, currentUser } = this.props;
    const { id, acceptedFriendIds: fIds } = currentUser;

    let allPosts = <p>No posts yet :(... Write something</p>
      
    if (Object.keys(posts).length > 0) {
      allPosts = Object.values(posts).reverse().map(post => {
        const { author_id: a_id, receiver_id: r_id } = post;
        
        if (!fIds.includes(a_id) || a_id === id || r_id === id) return null;
        
        return (
          <li key={ post.id } className='individual-post'>
            <PostDetailComponent post={ post } />
          </li>
        );
      });
    }

    return (
      <div className="posts-and-info-components" onClick={this.handleDropdown}>
        <LeftInfoComponent />
        <div className="create-post-all-posts">
          <NewPostComponent />
          <ul className="all-posts-ul">
            { allPosts }
          </ul>
        </div>
        <RightInfoComponent />
      </div>
    );
  }
}

const mapStatetoProps = state => {
  return {
    currentUser: state.session.currentUser || {},
    posts: state.entities.posts,
    dropdownOpen: Boolean(state.ui.dropdowns.displayed)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hideDropdown: () => dispatch(hideDropdown()),
    fetchAllComments: () => dispatch(fetchAllComments()),
    fetchAllPosts: () => dispatch(fetchAllPosts())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostsComponent));

