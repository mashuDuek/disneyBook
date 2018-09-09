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

  componentDidUpdate(newProps) {
    const receiverId = parseInt(newProps.match.params.userId);
    if (this.state.receiverId !== receiverId) {
      this.setState({ receiverId });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.create({
      body: this.state.body,
      receiver_id: this.state.receiverId
    }).then(() => this.setState({ body: '' }));
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
