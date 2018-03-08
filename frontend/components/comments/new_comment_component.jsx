import React from 'react';

class NewCommentComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { body: '', post_id: props.post.id };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createComment(this.state).then(() => {
      this.props.fetchPost(this.props.post).then(() => {
        this.setState({ body: '' });
      });
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState(
      Object.assign({}, this.state, { body: e.target.value})
    );
  }

  render() {
    const placeHolder = `Any thoughts, ${this.props.currentUser.name}?`;
    return(
      <div id="create-comment-all">
        <form onSubmit={this.handleSubmit} id="create-comment">
          <textarea
            placeholder={placeHolder}
            height="80"
            width="400"
            value={this.state.body}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            ></textarea>
          <button>
            Comment
          </button>
        </form>
      </div>
    );
  }
}

export default NewCommentComponent;
