import React from 'react';

class LeftInfoComponent extends React.Component {

  render () {
    return (
      <div id='left-info-component'>
        <p>Top Movies</p>
        <a href='http://www.imdb.com/title/tt0110357/awards'>Lion King</a>
        <a href='http://www.imdb.com/title/tt0103639/awards'>Aladdin</a>
        <a href='http://www.imdb.com/title/tt0101414/awards'>Beauty and the Beast</a>
      </div>
    );
  }
}

export default LeftInfoComponent;
