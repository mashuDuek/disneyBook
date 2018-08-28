import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import SearchResultItem from './search_result_item';

class SearchResults extends React.Component {
  render () {
    const users = Object.values(this.props.users).map((user, id) => {
      return (
        <li key={id}>
          <SearchResultItem user={user}></SearchResultItem>
        </li>
      );
    });

    return (
      <div className="searched-users">
        <ul className="users-list">
          {users}
        </ul>
      </div>
    );
  }
}

export default SearchResults;
