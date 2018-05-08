import React from 'react';
import ViewProfile from './view_profile_component';
import EditProfilePicComponent from './edit_profile_pic_component';


class ProfPicComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hover: false };
    this.handleProfileModal = this.handleProfileModal.bind(this);
    this.handleShowButton = this.handleShowButton.bind(this);
    this.handleHideButton = this.handleHideButton.bind(this);
  }

  handleShowButton () {
    if (this.props.user.id === this.props.currentUser.id) {
      this.setState({ hover: true });
    } else {
      this.setState({ hover: 'friend' });
    }
  }

  handleProfileModal(e) {
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
        <div className='icon-edit-profile' onClick={ this.handleProfileModal }>
          <i className="fa fa-camera" id="camera-icon" aria-hidden="true"></i>
        </div>
      );
    } else {
      icon = (
        <div className='icon-edit-profile' onClick={ this.handleProfileModal }>
          <i className="fa fa-camera" id="camera-icon" aria-hidden="true"></i>
        </div>
      );
    }

    return (
      <div>
        <div id="profile-photo">
          { icon }
          <img
            onMouseEnter={ this.handleShowButton }
            onClick={ this.handleProfileModal }
            src={ this.props.user.profilePic }>
          </img>
        </div>
      </div>
    );
  }
}

export default ProfPicComponent;
