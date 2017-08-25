import React from 'react';
import ModalComponent from '../modals/modal_component';
import EditPost from './edit_post';

class PostActionComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }
  // props include delete, update, post, showModal, and currentUser

  handleDelete() {
    this.props.delete(this.props.post);
  }

  handleEdit() {
    this.props.showModal(
      <EditPost
        edit={this.props.update}
        post={this.props.post}
        hideModal={this.props.hideModal}
      />
    ).then(() => {
      setState(this.props.post)
    })
  }

  render() {
    let optionsList;
    if (this.props.post.author_id === this.props.currentUser.id) {
      optionsList = (
        <ul>
          <li>
            <button onClick={this.handleDelete}>
              Delete Post
            </button>
          </li>
          <li>
            <button onClick={this.handleEdit}>
              Edit Post
            </button>
          </li>
        </ul>
      );
    } else {
      optionsList = (
        <ul>
          <li>
            u no author
          </li>
        </ul>
      )
    }
    return (
      <div className="post-action-options">
        {optionsList}
      </div>
    );
  }
}

export default PostActionComponent;
