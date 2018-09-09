import React from 'react';
import { Link } from 'react-router-dom';
import EditCommentComponent from './edit_comment_component';

class CommentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
  }

  handleModal () {
    this.props.showModal(
      <EditCommentComponent
        comment={this.props.comment}
        hideModal={this.props.hideModal}
        updateComment={this.props.updateComment}
        deleteComment={this.props.deleteComment}
        fetchPost={this.props.fetchPost}
        fetchAllComments={this.props.fetchAllComments}
        />
    );
  }

  // componentDidMount() {
  //   debugger
  //   if (!this.props.users[this.props.comment.author_id]) {
  //     this.props.fetchUser({ id: this.props.comment.author_id });
  //   }
  // }

  render() {
    if (!this.props.comment) return null;

    let editComment;
    if (this.props.currentUser.id === this.props.comment.author_id) {
      editComment = <button onClick={this.handleModal}>…</button>;
    } else {
      editComment = null;
    }

    const author = this.props.users[this.props.comment.author_id];
    if (!author) return <p>Loading...</p>;
    return (
      <div className="comment">
        <div id="comment-author">
          <div id="comment-author-pic-and-name">
            <img src={ author.profilePic }></img>
            <Link to={ `/users/${author.id}` }>{ author.name }</Link>
            <p className="comment-body">
              { this.props.comment.body }
            </p>
          </div>
          { editComment }
        </div>
      </div>
    );
  }
}

export default CommentsComponent;
