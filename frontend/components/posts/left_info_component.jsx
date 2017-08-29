import React from 'react';

class LeftInfoComponent extends React.Component {

  render () {
    return (
      <div id='left-info-component'>
        <p>Movie Awards</p>
        <a href='http://www.imdb.com/title/tt0110357/awards'>Lion King Awards</a>
        <br />
        <br />
        <a href='http://www.imdb.com/title/tt0103639/awards'>Aladdin Awards</a>
        <br />
        <br />
        <a href='http://www.imdb.com/title/tt0101414/awards'>Beauty and the Beast Awards</a>
      </div>
    )
  }
}

export default LeftInfoComponent;
