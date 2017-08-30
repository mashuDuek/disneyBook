import React from 'react';

class RightInfoComponent extends React.Component {

  render () {
    return (
      <div id='right-info-component'>
        <p>Dev Info</p>
        <br />
        <div className="linkedIn">
          <i className="fa fa-linkedin-square" aria-hidden="true"></i>
          <a href='https://www.linkedin.com/in/matthew-duek-51489657'>LinkedIn Mashu</a>
        </div>
        <div className="github">
          <i className="fa fa-github" aria-hidden="true"></i>
          <a href='https://github.com/mashuDuek'>GitHub Mashu</a>
        </div>
      </div>
    )
  }
}

export default RightInfoComponent;
