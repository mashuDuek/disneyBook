import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

class SearchResultItem extends React.Component {
  render() {
    return (
      <div className="user-item">
        <img src={this.props.user.profilePic}></img>
        <Link to={`/users/${this.props.user.id}`}>
          {this.props.user.name}
        </Link>
      </div>
    );
  }
}

export default SearchResultItem;
