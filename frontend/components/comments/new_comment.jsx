import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createComment } from '../../actions/comment_actions';
import { fetchPost } from '../../actions/posts_actions';

class NewComment extends React.Component {

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
        <form onSubmit={ this.handleSubmit } id="create-comment">
          <textarea
            height="80"
            width="400"
            id={`create-comment-textarea-${this.props.post.id}`}
            placeholder={ placeHolder }
            value={ this.state.body }
            onChange={ this.handleChange }
            onSubmit={ this.handleSubmit }
            ></textarea>
          <button>
            Comment
          </button>
        </form>
      </div>
    );
  }
}

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser,
    post: ownProps.post
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {

  return {
    createComment: (comment) => (dispatch(createComment(comment))),
    fetchPost: (post) => (dispatch(fetchPost(post))),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(NewComment));
