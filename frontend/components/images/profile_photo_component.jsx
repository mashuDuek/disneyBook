import React from 'react';
import ViewProfile from './view_profile_component';
import EditProfilePicComponent from './edit_profile_pic_component';


class ProfPicComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hover: false };
    this.handleCoverModal = this.handleCoverModal.bind(this);
    this.handleShowButton = this.handleShowButton.bind(this);
    this.handleHideButton = this.handleHideButton.bind(this);
  }

  handleShowButton () {
    debugger
    if (this.props.user.id === this.props.currentUser.id) {
      this.setState({ hover: true });
    } else {
      this.setState({ hover: 'friend' });
    }
  }

  handleCoverModal(e) {
    if (this.props.user.id === this.props.currentUser.id) {
      this.props.showModal(
        <EditProfilePicComponent
          user={ this.props.user }
          currentUser={ this.props.currentUser }
          updateCover={ this.props.updateCover }
          hideModal={ this.props.hideModal }
          />
      );
    } else {
      this.props.showModal(
        <ViewProfile
          user={ this.props.user }
          currentUser={ this.props.currentUser }
          updateCover={ this.props.updateCover }
          />
      );
    }
  }

  handleHideButton () { this.setState({ hover: false }); }

  render() {
    if (!this.props.user) <p>Loading...</p>;

    let icon;
    if (!this.state.hover) {
      icon = null;
    } else if (this.state.hover === 'friend') {
      icon = (
        <div className='icon-edit-profile'
          onMouseEnter={ this.handleShowButton }
          onClick={ this.handleCoverModal }
          >
          <i className="fa fa-camera" id="camera-icon" aria-hidden="true"></i>
          <p>View Profile Pics</p>
        </div>
      );
    } else {
      icon = (
        <div className='icon-edit-profile'
          onMouseEnter={ this.handleShowButton }
          onClick={ this.handleCoverModal }
          >
          <i className="fa fa-camera" id="camera-icon" aria-hidden="true"></i>
          <p>Edit Profile Pic</p>
        </div>
      );
    }

    return (
      <div>
        <div id="profile-photo">
          { icon }
          <img
            onMouseEnter={ this.handleShowButton }
            onClick={ this.handleCoverModal }
            src={ this.props.user.profilePic }>
          </img>
          <p className="user-name">
            { this.props.user.name }
          </p>
        </div>
      </div>
    );
  }
}

export default ProfPicComponent;
