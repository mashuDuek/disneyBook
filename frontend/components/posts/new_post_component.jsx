import React from 'react';

class NewPostComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        body: '',
        receiver_id: this.props.currentUser.id
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.create(this.state);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState(
      Object.assign({}, this.state, { body: e.target.value})
    );
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit} className="create-post">
        <textarea
          height="100"
          width="500"
          value={this.state.body}
          onChange={this.handleChange}
          ></textarea>
        <button>
          Create Post
        </button>
      </form>
    );
  }
}

export default NewPostComponent;
