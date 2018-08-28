import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

class SearchResultItem extends React.Component {
  render() {
    debugger
    return (
      <div>
        <a src={`/users/${this.props.user.id}`}>{this.props.user.name}</a>
      </div>
    );
  }
}

export default SearchResultItem;
