import React from 'react';

class ViewCover extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    return(
      <div className="pic-modal-wrapper">
        <div className='edit-cover-pic'>
          <img src={ this.props.user.coverPic }></img>
        </div>
      </div>
    );
  }
}

export default ViewCover;
