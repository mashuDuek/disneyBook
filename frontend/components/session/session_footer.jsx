import React from 'react';

class SessionFooter extends React.Component {

  render() {
    return(
      <ul id="footer-links">
        <a href="http://movies.disney.com/all-movies">All Movies</a>
        <a href="https://www.google.com/">Google Search</a>
        <a href="https://www.google.com/search?q=best+disney+movies&oq=best+disney+movies&aqs=chrome.0.0l6.2691j0j4&sourceid=chrome&ie=UTF-8">Most Popular</a>
        <a href="http://www.imdb.com/list/ls000422381/">Top 100</a>
      </ul>

    );
  }
}

export default SessionFooter;
