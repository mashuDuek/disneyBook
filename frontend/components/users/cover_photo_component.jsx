import React from 'react';

class CoverPhotoComponent extends React.Component {
  render () {
    return (
      <div id="cover-photo">
        <img src={this.props.user.cover_url}></img>
      </div>
    )
  }
}

export default CoverPhotoComponent;
