import React from 'react';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    debugger
    this.props.delete(this.props.post);
  }

  // componentDidMount () {
  // }
  //   I need to do something in one of these ? Why do I have no props ??
  // componentWillReceiveProps(nextProps) {
  //   debugger
  // }


// INSTEAD OF THE A TAG I WILL NEED A LINK TAG TO THE PROFILE
  render() {
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
          <button onClick={this.handleDelete}>Delete</button>
        </li>
      )
    };
  }
}

export default PostDetailComponent;
