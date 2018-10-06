import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updatePost, deletePost } from '../../actions/posts_actions';
import { showModal } from '../../actions/modal_actions';
import { hideDropdown } from '../../actions/dropdown_actions';
import EditPost from './edit_post';

class PostActionComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleDelete() {
    this.props.deletePost(this.props.post).then(this.props.hideDropdown);
  }

  handleEdit() {
    this.props.showModal(
      <EditPost
        post={this.props.post}
        updatePost={this.props.updatePost}
        />
    );
  }
  render() {
    let optionsList;
    if (this.props.post.author_id === this.props.currentUser.id) {
      optionsList = (
        <ul id="post-options">
          <li onClick={ this.handleDelete }>
            <button>Delete</button>
          </li>
          <li onClick={ this.handleEdit }>
            <button>Edit</button>
          </li>
        </ul>
      );
    } else {
      optionsList = <p>No actions</p>;
    }

    return (
      <div className="post-action-options">
        { optionsList }
      </div>
    );
  }
}

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser || {},
    post: ownProps.post,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deletePost: (post) => dispatch(deletePost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    showModal: (component) => dispatch(showModal(component)),
    hideDropdown: () => dispatch(hideDropdown()),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostActionComponent));

