import React from 'react';

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { post: this.props.post };
  }

  handleEdit(e) {
    this.props.updatePost(this.state).then(() => {
      this.props.hideModal();
    });
  }

  handleChange(field) {
    return (e) => {
      const edited = Object.assign(
        {}, this.state.post, { [field]: e.currentTarget.value }
      );
      this.setState({ post: edited });
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   const postToEdit = Object.assign(
  //     {}, this.state.post, nextProps.post
  //   );
  //   this.setState({ post: postToEdit });
  // }

  render(){
    return(
      <form className='edit-post' onSubmit={this.handleEdit}>
        <label>Edit Post
          <input
            value={this.state.post.body}
            onChange={this.handleChange('body')} />
        </label>
        <button>Edit Post!</button>
      </form>
    );
  }
}

export default EditPost;
