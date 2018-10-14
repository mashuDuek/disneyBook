import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import EditCoverPicComponent from './edit_cover_pic_component.jsx';
import ViewCover from './view_cover_component';
import { showModal, hideModal } from '../../actions/modal_actions';
import { updateCoverPic } from '../../actions/image_actions';

class CoverPhoto extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hover: false };
    this.handleCoverModal = this.handleCoverModal.bind(this);
    this.handleShowButton = this.handleShowButton.bind(this);
    this.handleHideButton = this.handleHideButton.bind(this);
  }

  handleCoverModal(e) {
    if (this.props.user.id === this.props.currentUser.id) {
      this.props.showModal(
        <EditCoverPicComponent
          user={ this.props.user }
          currentUser={ this.props.currentUser }
          updateCover={ this.props.updateCover }
          hideModal={ this.props.hideModal }
          />
      );
    } else {
      this.props.showModal(
        <ViewCover
          user={ this.props.user }
          currentUser={ this.props.currentUser }
          updateCover={ this.props.updateCover }
          />
      );
    }
  }

  handleShowButton () {
    if (this.props.user.id === this.props.currentUser.id) {
      this.setState({ hover: true });
    } else {
      this.setState({ hover: 'friend' });
    }
  }

  handleHideButton () { this.setState({ hover: false }); }

  render () {
    if (!this.props.user) { return <p>Loading...</p>; }

    let icon;
    if (!this.state.hover) {
      icon = null;
    } else if (this.state.hover === 'friend') {
      icon = (
        <div className='icon-edit-cover'
          onMouseEnter={ this.handleShowButton }
          onClick={ this.handleCoverModal }
          >
          <i className="fa fa-camera" id="camera-icon" aria-hidden="true"></i>
          <p>View Cover Pics</p>
        </div>
      );
    } else {
      icon = (
        <div className='icon-edit-cover'
          onMouseEnter={ this.handleShowButton }
          onClick={ this.handleCoverModal }
          >
          <i className="fa fa-camera" id="camera-icon" aria-hidden="true"></i>
          <p>Edit Cover Pic</p>
        </div>
      );
    }

    return (
      <div id="cover-photo" onMouseLeave={ this.handleHideButton }>
        { icon }
        <img
          onMouseEnter={ this.handleShowButton }
          onClick={ this.handleCoverModal }
          src={ this.props.user.coverPic }
          >
        </img>
      </div>
    );
  }
}

const mapStatetoProps = (state, ownProps) => {
  return {
    user: state.entities.users[ownProps.match.params.userId],
    currentUser: state.session.currentUser || {},
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showModal: (component) => dispatch(showModal(component)),
    hideModal: () => dispatch(hideModal()),
    updateCover: (image) => dispatch(updateCoverPic(image)),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(CoverPhoto));