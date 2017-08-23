import React from 'react';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <li key={this.props.post.id}>
        {this.props.post.body}
        <br />
        Id: {this.props.post.author_id}
      </li>
    );
  }
}

export default PostDetailComponent;
