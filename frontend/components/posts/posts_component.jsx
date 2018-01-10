import { Link, Redirect, withRouter } from 'react-router-dom';
import React from 'react';
import values from 'lodash/values';
import NewPostContainer from './new_post_container';
import PostDetailComponent from './post_detail_component';
import PostDetailContainer from './post_detail_container';
import LeftInfoComponent from './left_info_component';
import RightInfoComponent from './right_info_component';

class PostsComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const drops = this.props.dropdowns;
    let dropdownAction;
    if (Boolean(drops.displayed) || Boolean(drops.component)) {
      dropdownAction = this.props.hideDropdown;
    } else {
      dropdownAction = (e) => { e.stopPropagation(); };
    }

    if (Object.keys(this.props.posts).length < 1) {
      return (<p>Loading posts...</p>);
    } else {
      const acceptedFriendIds = this.props.currentUser.acceptedFriends.map((friend) => {
        return friend.id;
      });

      let goodPosts = [];
      Object.keys(this.props.posts).forEach((id) => {
        if (this.props.currentUser.id === this.props.posts[id].author_id) {
          goodPosts.push(this.props.posts[id]);
        } else if (acceptedFriendIds.includes(this.props.posts[id].author_id)) {
          goodPosts.push(this.props.posts[id]);
        }
      });

      const postValues = values(goodPosts);
      var posts = postValues.reverse().map((post) => {
        if (!post) {
          return null;
        } else {
          return(
            <li key={post.id} className='individual-post'>
              <PostDetailContainer post={post} />
            </li>
          );
        }
      });
    }

    return (
    <div className="posts-and-info-components" onClick={ dropdownAction }>
      <LeftInfoComponent />
      <div className="create-post-all-posts">
        <NewPostContainer />
        <ul className="all-posts-ul">
          {posts}
        </ul>
      </div>
      <RightInfoComponent />
    </div>
    );
  }
}

export default PostsComponent;
