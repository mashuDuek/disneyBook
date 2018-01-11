import React from 'react';
import EditCoverPicComponent from './edit_cover_pic_component.jsx';

class CoverPhotoComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleCoverModal = this.handleCoverModal.bind(this);
  }

  handleCoverModal(e) {
    if (this.props.user.id === this.props.currentUser.id) {
      this.props.showModal(
        <EditCoverPicComponent
          user={this.props.user}
          currentUser={this.props.currentUser}
          updateCover={this.props.updateCover}
          />
      );
    }
  }

  render () {
    if (!this.props.user) {
      return (
        <p>Loading...</p>
      );
    }

    return (
      <div id="cover-photo">
        <img onClick={this.handleCoverModal} src={this.props.user.coverPic}></img>
      </div>
    );
  }
}

export default CoverPhotoComponent;
