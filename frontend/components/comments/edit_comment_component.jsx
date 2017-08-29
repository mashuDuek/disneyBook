import React from 'react';

class EditComment extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { comment: this.props.comment };
    this.modalClose = this.modalClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  handleDelete() {
    this.props.deleteComment(this.state.comment).then (() => {
      this.modalClose();
    });
  }

  handleEdit() {
    this.props.updateComment(this.state).then(() => {
      this.modalClose();
    });
  }

  modalClose() {
    this.props.hideModal();
  }

  handleChange(field) {
    return (e) => {
      const edited = Object.assign(
        {}, this.state.comment, { [field]: e.currentTarget.value }
      );
      this.setState({ comment: edited });
    };
  }

  render(){
    return(
      <div className='edit-comment'>

        <div className='edit-comment-label'>
          <label>Edit</label>
          <button onClick={this.modalClose}>X</button>
        </div>
        <form onSubmit={this.handleEdit}>
            <textarea
              value={this.state.comment.body}
              onChange={this.handleChange('body')}
            />
          <button>Save</button>
        </form>
        <button onClick={this.handleDelete}>Delete</button>
      </div>
    );
  }
}

export default EditComment;
