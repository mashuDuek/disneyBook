import React from 'react';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleDelete() {
    this.props.delete(this.props.post);
  }

  handleUpdate() {
    this.props.update(this.props.post);
  }

// INSTEAD OF THE A TAG I WILL NEED A LINK TAG TO THE PROFILE
  render() {
    let editDropdown;
  // fix the dropdown to actually work. preferably make the update a modal
    if (this.props.currentUser.id === this.props.post.author_id) {
      editDropdown = (
        <select>
          <option disabled selected value></option>
          <option onClick={this.handleUpdate}>Edit</option>
          <option onClick={this.handleDelete}>Delete</option>
        </select>
      );
    }

    if (!this.props.users[this.props.post.author_id]) {
      return (
        <p>Loading...</p>
      );
    } else {
      const authorObj = this.props.users[this.props.post.author_id]
      return(
        <li key={this.props.post.id}>
          <div id="post-author-info">
            <a>{authorObj.name}</a>
            {editDropdown}
          </div>
          <br />
          {this.props.post.body}
        </li>
      )
    };
  }
}

export default PostDetailComponent;
