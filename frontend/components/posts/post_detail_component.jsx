import React from 'react';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);
  }


// INSTEAD OF THE A TAG I WILL NEED A LINK TAG TO THE PROFILE
  render() {
    if (!this.props.post.author) {
      return (
        <p>Loading...</p>
      );
    } else {
      return(
        <li key={this.props.post.id}>
          {this.props.post.body}
          <br />
          Author: <a>{this.props.post.author.name}</a>
        </li>
      )
    };
  }
}

export default PostDetailComponent;
