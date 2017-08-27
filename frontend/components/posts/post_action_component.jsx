import React from 'react';
import ModalComponent from '../modals/modal_component';
import EditPostContainer from './edit_post_container';

class PostActionComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = { actionsVisible: this.props.actionsVisible }
  }

  handleDelete() {
    this.setState({ actionsVisible: !this.props.actionsVisible });
    this.props.deletePost(this.props.post);

  }

  handleEdit() {
    this.setState({ actionsVisible: !this.props.actionsVisible });
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
