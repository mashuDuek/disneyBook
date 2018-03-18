import React from 'react';
import { Link } from 'react-router-dom';
import CommentContainer from '../comments/comment_container';
import PostActionContainer from './post_action_container';
import NewCommentContainer from '../comments/new_comment_container';
import DropdownContainer from '../dropdowns/dropdown_container';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dropdownVisible: false };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  handleDelete() {
    this.props.deletePost(this.props.post);
  }

  handleDropdown(e) {
    e.stopPropagation();
    this.props.displayDropdown(this.props.post.id);
  }

  render() {
    let comments;
    if (this.props.post.comments.length > 0) {
      comments = this.props.post.comments.map(comm => {
        return (
          <CommentContainer
            key={ comm.id }
            comment={ this.props.comments[comm] }
            post={ this.props.post }
          />
        );
      });
    } else {
      comments = null;
    }
    if (!this.props.post) {
      return (
        <p>Loading...</p>
      );
    } else {
      let authorObj;
      if (!this.props.author) {
        return (
          <p>Loading...</p>
        );
      } else {
        authorObj = this.props.author;
      }

      let receiver;
      if (this.props.author.id === this.props.receiver.id) {
        receiver = null;
      } else {
        receiver = (
          <Link to={ `/users/${this.props.receiver.id}` }>
            { `> ${this.props.receiver.name}` }
          </Link>
        );
      }

      return (
        <div id="post-item">
          <div id="post-author-info">
            <div id="author-pic-and-name">
              <img src={ authorObj.profilePic }
                sizes="(max-height: 40px; max-width: 40px;)" >
              </img>
              <Link to={ `/users/${authorObj.id}` }>
                { `${authorObj.name} >` }
              </Link>
              { receiver }
            </div>
            <button onClick={ this.handleDropdown }>ˇ</button>
            {
              this.props.dropdownVisible ?
              <PostActionContainer
                post={ this.props.post }
                updatePost={ this.props.updatePost.bind(this) }
                /> : null
            }
          </div>
          <br />
          <div id="post-body">
            { this.props.post.body }
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
          <ul>
            { comments }
          </ul>
          <NewCommentContainer
            post={ this.props.post }
            />
        </div>
      );
    }
  }
}

export default PostDetailComponent;
