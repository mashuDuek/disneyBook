import React from 'react';
import { Link } from 'react-router-dom';
import CommentContainer from '../comments/comment_container';
import PostActionContainer from './post_action_container';
import NewCommentContainer from '../comments/new_comment_container';
import DropdownContainer from '../dropdowns/dropdown_container';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDropdowns = this.handleDropdowns.bind(this);
  }

  handleDelete() {
    this.props.deletePost(this.props.post);
  }

  handleDropdowns(e) {
    // const boundUpdate = ;
    e.stopPropagation();
    this.props.showDropdown(`post-${this.props.post.id}`);
  }

  render() {

    let comments;
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
            <div id="author-pic-and-name">
              <img src={authorObj.profilePicUrl}
                sizes="(max-height: 40px; max-width: 40px;)" >
              </img>
              <Link to={`/users/${authorObj.id}`}>{authorObj.name}</Link>
            </div>
            <button onClick={this.handleDropdowns}>ˇ</button>
            {
              this.props.dropdownVisible ?
                <PostActionContainer
                  post={this.props.post}
                  updatePost={this.props.updatePost.bind(this)}
                /> :
                null
            }
          </div>
          <br />
          <div id="post-body">
            {this.props.post.body}
          </div>
          <div id="create-comment-icons">
            <div className='icons-create-comment'>
              <i className="fa fa-thumbs-up" aria-hidden="true"></i>
              <p>Like</p>
            </div>
            <div className='icons-create-comment'>
              <i className="fa fa-comment" aria-hidden="true"></i>
              <p>Comment</p>
            </div>
          </div>
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
