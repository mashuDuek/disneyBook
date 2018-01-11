import React from 'react';
import EditCoverPicComponent from './edit_cover_pic_component.jsx';

class CoverPhotoComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleCoverModal = this.handleCoverModal.bind(this);
  }

  handleCoverModal(e) {
    debugger
    this.props.showModal(
      <EditCoverPicComponent user={this.props.user} updateCover={this.props.updateCover}/>
    );
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
