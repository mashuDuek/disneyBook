import React from 'react';

class RightInfoComponent extends React.Component {

  render () {
    return (
      <div id='right-info-component'>
        <div className="linkedIn">
          <i className="fa fa-linkedin-square" aria-hidden="true">
            <a href='https://www.linkedin.com/in/matthew-duek-51489657'></a>
          </i>
        </div>
        <div className="github">
          <i className="fa fa-github" aria-hidden="true">
            <a href='https://github.com/mashuDuek'></a>
          </i>
        </div>
      </div>
    );
  }
}

export default RightInfoComponent;
