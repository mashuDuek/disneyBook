import React from 'react';
import EditCommentComponent from './edit_comment_component';

class CommentsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
  }

  handleModal () {
    this.props.showModal(
      <EditCommentComponent
        post={this.props.post}
        hideModal={this.props.hideModal}
        />
    );
  }

  render() {
    let editComment;
    if (this.props.currentUser.id === this.props.comment.author_id) {
      // debugger
      editComment = (
        <button onClick={this.handleModal}>Edit</button>
      )
    } else {
      editComment = null;
    }
    return (
      <div className="comment">
        <p className="comment-author">
          {this.props.users[this.props.comment.author_id].name}
        </p>
        <p className="comment-body">
          {this.props.comment.body}
        </p>
        {editComment}
      </div>
    );
  }
}

export default CommentsComponent;
