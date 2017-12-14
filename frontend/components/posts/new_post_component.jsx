import React from 'react';

class NewPostComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      body: '',
      receiverId: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let receiver;
    if (!this.props.user) {
      receiver = this.props.currentUser;
    } else {
      receiver = this.props.user;
    }
    this.setState({ receiverId: receiver.id });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.create({ body: this.state.body, receiver_id: this.state.receiverId }).then(() => {
      this.setState({ body: '' });
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState(
      Object.assign({}, this.state, { body: e.target.value })
    );
  }

  render() {
    if (!this.props.currentUser) {
      return (<p>Loading...</p>);
    }

    if (this.props.user) {
      if (this.props.user.id !== this.state.receiverId) {
        this.setState({ receiverId: this.props.user.id });
      }
    }

    if (!this.state.receiverId) {
      this.setState({ receiverId: this.props.currentUser.id });
    }

    const placeHolder = `What's on your mind, ${this.props.currentUser.name}?`;

    return (
      <form onSubmit={this.handleSubmit} className="create-post">
        <textarea
          placeholder={placeHolder}
          height="100"
          width="500"
          value={this.state.body}
          onChange={this.handleChange}
          >
        </textarea>
        <button>
          Post
        </button>
      </form>
    );
  }
}

export default NewPostComponent;
