import React from 'react';
import { Link } from 'react-router-dom';
import CommentContainer from '../comments/comment_container';
import PostActionContainer from './post_action_container';
import NewCommentContainer from '../comments/new_comment_container';


class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { actionsVisible: false };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.toggleActionVisibility = this.toggleActionVisibility.bind(this);
  }

  handleDelete() {
    this.props.deletePost(this.props.post);
  }

  handleEdit() {
    this.setState({ actionsVisible: !this.state.actionsVisible });
  }

  toggleActionVisibility() {
    this.setState({ actionsVisible: !this.state.actionsVisible });
  }


  render() {
//1 INSTEAD OF THE A TAG I WILL NEED A LINK TAG TO THE PROFILE
//2 eventually will add actions to this component. to defriend, etc.
//2 so not just the post author will be able to access the actionComponent(EditComponent)
    const boundUpdate = this.props.updatePost.bind(this);
    const actionsShow = (
      <PostActionContainer
        post={this.props.post}
        updatePost={boundUpdate}
        toggleActionVisibility={this.toggleActionVisibility}
        />
    )


    let comments;
    debugger
    if (this.props.post.comments.length > 0) {

      const commToPass = this.props.comments
      comments = this.props.post.comments.map(comm => {
        return (
          <div className='comments'>
            <CommentContainer
              comment={commToPass[comm]}
              post={this.props.post}
              />
          </div>
        );
      })
    }

    if (!this.props.post) {
      return (
        <p>Loading...</p>
      );
    } else {
      const authorObj = this.props.users[this.props.post.author_id];
      return(
        <li key={this.props.post.id}>
          <div id="post-author-info">
            <Link to={`/users/${authorObj.id}`}>{authorObj.name}</Link>
            <button onClick={this.handleEdit}>ˇ</button>
            {this.state.actionsVisible ? actionsShow : null}
          </div>
          <br />
          {this.props.post.body}
          {comments}
          <NewCommentContainer
            currentUser={this.props.currentUser}
            post={this.props.post}
            />
        </li>
      )
    };
  }
}

export default PostDetailComponent;
