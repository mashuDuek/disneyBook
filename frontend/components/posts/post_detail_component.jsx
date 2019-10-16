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

  commentFocus() {
    document.getElementById(`create-comment-textarea-${this.props.post.id}`).
      focus({ preventScroll: true });
  }

  commentsRender(post, comments) {
    if (post.comments.length == 0) return null;
    if (Object.keys(comments).length < 1) return null;

    return post.comments.map(id => {
      return (
        <CommentComponent
          key={id}
          comment={comments[id]}
          post={post}
        />
      );
    });
  }

  render() {
    const { post, comments, users, updatePost, dropdownVisible } = this.props;
    const comms = this.commentsRender(post, comments);
    const author = users[post.author_id];
    let receiver = users[post.receiver_id];

    if (!post || !author || !receiver) return <p>Loading...</p>;

    let renderReceiver = null;
    if (post.author_id != post.receiver_id) {
      renderReceiver = (
        <Link to={`/users/${post.receiver_id}`} style={{"marginLeft":"5px"}}>
          {`>> ${receiver.name}`}
        </Link>
      );
    }

    return (
      <div className="post-item">
        <div className="post-author-info">
          <div id="author-pic-and-name">
            <img src={author.profilePic}
              sizes="(max-height: 40px; max-width: 40px;)" >
            </img>
            <Link to={`/users/${author.id}`}>
              {`${author.name}`}
            </Link>
            {renderReceiver}
          </div>
          <button onClick={this.handleDropdown}>ˇ</button>
          { dropdownVisible ? 
              <PostActionComponent 
                post={post} updatePost={updatePost.bind(this)}/> 
                : null
          }
        </div>
        <br />
        <div id="post-body">{post.body}</div>
        <div id="create-comment-icons">
          <div className="icons-create-comment" onClick={this.handleLikeToggle}>
            <p>{post.likes.length}</p>
            <i className="fa fa-thumbs-up" aria-hidden="true"></i>
            <p>Like</p>
          </div>
          <div className="icons-create-comment" onClick={this.commentFocus}>
            <i className="fa fa-comment" aria-hidden="true"></i>
            <p>Comment</p>
          </div>
        </div>
        <ul>{comms} </ul>
        <NewComment post={post}/>
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

