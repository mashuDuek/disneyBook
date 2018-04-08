import React from 'react';
import EditPostContainer from './edit_post_container';

class PostActionComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleDelete() {
    this.props.deletePost(this.props.post).then(this.props.hideDropdown);
  }

  handleEdit() {
    this.props.showModal(
      <EditPostContainer
        post={this.props.post}
        updatePost={this.props.updatePost}
        />
    );
  }
  render() {
    let optionsList;
    if (this.props.post.author_id === this.props.currentUser.id) {
      optionsList = (
        <ul id="post-options">
          <li onClick={ this.handleDelete }>
            <button>Delete</button>
          </li>
          <li onClick={ this.handleEdit }>
            <button>Edit</button>
          </li>
        </ul>
      );
    } else {
      optionsList = <p>No actions</p>;
    }

    return (
      <div className="post-action-options">
        { optionsList }
      </div>
    );
  }
}

export default PostActionComponent;
