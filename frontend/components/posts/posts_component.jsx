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

    if (Object.keys(this.props.posts).length < 1) return <p>Loading posts...</p>;
    let stringIds;
    if (!this.props.currentUser.acceptedFriends) {
      stringIds = [];
    } else {
      stringIds = this.props.currentUser.acceptedFriends;
    }

    const allPosts = this.props.posts;
    const acceptedFriendIds = stringIds.map((el) => parseInt(el));
    const that = this;
    let goodPosts = [];
    Object.keys(allPosts).forEach((id) => {
      if (
          acceptedFriendIds.includes(allPosts[id].author_id) ||
          allPosts[id].author_id === that.props.currentUser.id ||
          allPosts[id].receiver_id === that.props.currentUser.id
      ) {
        goodPosts.push(allPosts[id]);
      }
    });

    const postValues = values(goodPosts);
    var posts = postValues.reverse().map((post) => {
      if (!post) return null;
      const author = this.props.users[post.author_id];
      const receiver = this.props.users[post.receiver_id];
      return(
        <li key={ post.id } className='individual-post'>
          <PostDetailContainer post={ post } />
        </li>
      );
    });
    return (
      <div className="posts-and-info-components" onClick={ dropdownAction }>
        <LeftInfoComponent />
        <div className="create-post-all-posts">
          <NewPostContainer />
          <ul className="all-posts-ul">
            { posts }
          </ul>
        </div>
        <RightInfoComponent />
      </div>
    );
  }
}

export default PostsComponent;
