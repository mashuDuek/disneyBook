import React from 'react';
import EditPostContainer from './edit_post_container';

class PostActionComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleDelete() {
    this.props.deletePost(this.props.post);
  }

  handleEdit() {
    this.props.showModal(
      <EditPostContainer post={this.props.post} updatePost={this.props.updatePost} />
    )
  }

  render() {

    let optionsList;
    if (this.props.post.author_id === this.props.currentUser.id) {
      optionsList = (
        <ul>
          <li>
              <button onClick={this.handleDelete}>
                Delete
              </button>

          </li>
          <li>
              <button onClick={this.handleEdit}>
                Edit
              </button>
          </li>
        </ul>
      );
    } else {
      optionsList = (
        <ul>
          <li>
            No author detected
          </li>
        </ul>
      )
    }
    return (
      <div id="post-action-options">
        {optionsList}
      </div>
    );
  }
}

export default PostActionComponent;
