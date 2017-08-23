import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { getKeys } from '../../reducers/selectors';
import values from 'lodash/values';


class PostsComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const posts = values(this.props.posts).map((post) => {
      return(
        <li key={post.id}>
          {post.body}{post.author_id}{post.receiver_id}
        </li>
      );
    });

    return(
      <ul>
        {posts}
      </ul>
    );
  }
}

export default PostsComponent;
