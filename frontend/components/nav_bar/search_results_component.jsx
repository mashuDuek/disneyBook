import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import SearchResultItem from './search_result_item';

class SearchResults extends React.Component {
  render () {
    const userValues = Object.values(this.props.users);
    if (userValues.length < 1) return null;

    const users = userValues.map((user, id) => {
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
