import React from 'react';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.delete(this.props.post);
  }

// INSTEAD OF THE A TAG I WILL NEED A LINK TAG TO THE PROFILE
  render() {
    let editButton;
    // eventually this shoul be a drop down for editting or deleting
    if (this.props.currentUser.id === this.props.post.author_id) {
      editButton = (
        <button onClick={this.handleDelete}>Delete</button>
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
          {this.props.post.body}
          <br />
          Author: <a>{authorObj.name}</a>

          {editButton}
        </li>
      )
    };
  }
}

export default PostDetailComponent;
