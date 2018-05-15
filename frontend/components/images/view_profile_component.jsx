import React from 'react';

class ViewProfile extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    return(
      <div className="pic-modal-wrapper">
        <div className='edit-profile-pic'>
          <img src={ this.props.user.profilePic }></img>
        </div>
      </div>
    );
  }
}

export default ViewProfile;
