import React from 'react';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);
  }

// INSTEAD OF THE A TAG I WILL NEED A LINK TAG TO THE PROFILE
  render() {
    // debugger
    if (!this.props.users[this.props.post.author_id]) {
      return (
        <p>Loading...</p>
      );
    } else {
      // debugger
      const authorObj = this.props.users[this.props.post.author_id]
      return(
        <li key={this.props.post.id}>
          {this.props.post.body}
          <br />
          Author: <a>{authorObj.name}</a>
        </li>
      )
    };
  }
}

export default PostDetailComponent;