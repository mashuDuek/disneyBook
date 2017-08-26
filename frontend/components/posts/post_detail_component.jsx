import React from 'react';
import PostActionComponent from './post_action_component';

class PostDetailComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { actionsVisible: false };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleDelete() {
    this.props.delete(this.props.post);
  }

  handleEdit() {
    this.setState({ actionsVisible: !this.state.actionsVisible });
  }

  render() {

//1 INSTEAD OF THE A TAG I WILL NEED A LINK TAG TO THE PROFILE
//2 eventually will add actions to this component. to defriend, etc.
//2 so not just the post author will be able to access the actionComponent(EditComponent)
    let actionsShow = (
      <PostActionComponent
        post={this.props.post}
        delete={this.props.delete}
        update={this.props.update}
        currentUser={this.props.currentUser}
        showModal={this.props.showModal}
        hideModal={this.props.hideModal}
        >
      </PostActionComponent>
    )
    
    if (!this.props.users[this.props.post.author_id]) {
      return (
        <p>Loading...</p>
      );
    } else {
      const authorObj = this.props.users[this.props.post.author_id]
      return(
        <li key={this.props.post.id}>
          <div id="post-author-info">
            <a>{authorObj.name}</a>
            <button onClick={this.handleEdit}></button>
            {this.state.actionsVisible ? actionsShow : null}
          </div>
          <br />
          {this.props.post.body}
        </li>
      )
    };
  }
}

export default PostDetailComponent;
