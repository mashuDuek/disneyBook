import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import CommentComponent from '../comments/comment_component';
import PostActionComponent from './post_action_component';
import NewComment from '../comments/new_comment';
import { updatePost, deletePost } from '../../actions/posts_actions';
import { displayDropdown } from '../../actions/dropdown_actions';
import { createLike, deleteLike } from '../../actions/like_actions';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.commentFocus = this.commentFocus.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleLikeToggle = this.handleLikeToggle.bind(this);
  }

  handleDelete() {
    this.props.deletePost(this.props.post);
  }

  handleLikeToggle () {
    if (this.props.post.currentUserLikes) {
      this.props.deleteLike({
        post_id: this.props.post.id,
        liker_id: this.props.currentUser.id
      });
    } else {
      this.props.createLike({ post: this.props.post });
    }
  }

  handleDropdown(e) {
    e.stopPropagation();
    this.props.displayDropdown(this.props.post.id);
  }

  commentFocus () {
    document.getElementById(`create-comment-textarea-${this.props.post.id}`).
      focus({ preventScroll: true });
  }

  render() {
    let comments;
    if (this.props.post.comments.length > 0) {
      if (Object.keys(this.props.comments).length < 1) {
        comments = null;
      } else {
        comments = this.props.post.comments.map(id => {
          return (
            <CommentComponent
              key={ id }
              comment={ this.props.comments[id] }
              post={ this.props.post }
            />
          );
        });
      }
    } else {
      comments = null;
    }

    if (
      !this.props.post ||
      !this.props.users[this.props.post.author_id] || 
      !this.props.users[this.props.post.receiver_id]
    ) return <p>Loading...</p>;

    const authorObj = this.props.users[this.props.post.author_id];

    let receiver;
    if (this.props.post.author_id === this.props.post.receiver_id) {
      receiver = null;
    } else {
      receiver = (
        <Link to={ `/users/${this.props.post.receiver_id}` } style={{"marginLeft":"5px"}}>
          { `>> ${this.props.users[this.props.post.receiver_id].name}` }
        </Link>
      );
    }

    return (
      <div className="post-item">
        <div className="post-author-info">
          <div id="author-pic-and-name">
            <img src={ authorObj.profilePic }
              sizes="(max-height: 40px; max-width: 40px;)" >
            </img>
            <Link to={ `/users/${authorObj.id}` }>
              { `${authorObj.name}` }
            </Link>
            { receiver }
          </div>
          <button onClick={ this.handleDropdown }>ˇ</button>
          {
            this.props.dropdownVisible ?
            <PostActionComponent
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
          <div className="icons-create-comment" onClick={ this.handleLikeToggle }>
            <p>{ this.props.post.likes.length }</p>
            <i className="fa fa-thumbs-up" aria-hidden="true"></i>
            <p>Like</p>
          </div>
          <div className="icons-create-comment" onClick={ this.commentFocus }>
            <i className="fa fa-comment" aria-hidden="true"></i>
            <p>Comment</p>
          </div>
        </div>
        <ul>
          { comments }
        </ul>
        <NewComment
          post={ this.props.post }
          />
      </div>
    );
  }

}

const mapStatetoProps = (state, ownProps) => {
  return {
    dropdownVisible: state.ui.dropdowns.displayed === ownProps.post.id,
    currentUser: state.session.currentUser || {},
    comments: state.entities.comments,
    posts: state.entities.posts,
    users: state.entities.users,
    post: ownProps.post,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    createLike: (like) => dispatch(createLike(like)),
    deleteLike: (like) => dispatch(deleteLike(like)),
    displayDropdown: (component) => dispatch(displayDropdown(component)),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostDetailComponent));

