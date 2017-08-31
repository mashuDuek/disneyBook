import React from 'react';

class CoverPhotoComponent extends React.Component {
  render () {

    if (!this.props.user) {
      return (
        <p>Loading...</p>
      );
    }

    let cover;
    if (!this.props.user.cover_url) {
      cover = "https://i.pinimg.com/originals/77/a7/e3/77a7e37f42d25404191efc8ca82f5842.jpg";
    } else {
      cover = this.props.user.cover_url;
    }
    return (
      <div id="cover-photo">
        <img src={cover}></img>
      </div>
    )
  }
}

export default CoverPhotoComponent;
