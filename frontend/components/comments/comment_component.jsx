import React from 'react';

class CommentsComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="comment">
        <p className="comment-author">
          {this.props.users[this.props.comment.author_id].name}
        </p>
        <p className="comment-body">
          {this.props.comment.body}
        </p>
      </div>
    );
  }
}

export default CommentsComponent;
