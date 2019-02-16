import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import NavBarActions from './nav_bar_actions';
import PendingReqs from './nav_bar_pending_reqs';
import SearchResults from './search_results_component';

import { connect } from 'react-redux';
import { showDropdown, hideDropdown } from '../../actions/dropdown_actions';
import { fetchSearchedUsers } from '../../actions/user_actions';

class NavBar extends React.Component {
  constructor (props) {
    super (props);

    this.state = { search: "" };

    this.showActionsContainer = this.showActionsContainer.bind(this);
    this.showPendingRequests = this.showPendingRequests.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput (e) {
    if (e.currentTarget.value === "") {
      this.props.hideDropdown();
    } else {
      this.setState(
        { search: e.currentTarget.value },
        () => this.props.fetchSearchedUsers(this.state.search).then(() => {
          this.props.showDropdown(
            <SearchResults users={this.props.searchedUsers}>
            </SearchResults>
          );
        })
      );
    }
  }

  showActionsContainer (e) {
    e.stopPropagation();
    this.props.showDropdown(<NavBarActions />);
  }

  showPendingRequests (e) {
    e.stopPropagation();
    this.props.showDropdown(<PendingReqs />);
  }

  render() {
    let link;
    let linkAndPic;
    if (!this.props.currentUser) {
      link = null;
      linkAndPic = null;
    } else {
      link = (
        <Link to={`/users/${this.props.currentUser.id}`}>
          {this.props.currentUser.name}
        </Link>
      );

      linkAndPic = (
        <Link to={`/users/${this.props.currentUser.id}`}>
          <img src={this.props.currentUser.profilePic}></img>
        </Link>
      );
    }
    
    return (
      <div className="nav-bar">
        <form id="search-form">
          <input
            onChange={this.handleSearchInput}
            placeholder="Search Users">
          </input>
          <i className="fa fa-search" aria-hidden="true"></i>
        </form>

        <div>
          <div id="nav-bar-welcome-logout">
            { linkAndPic }
            <div className="user-pic-name-and-home">
              <p className="user-name">
                { link }
              </p>
              <p className="home-link">
                <Link to={`/feed`}>Home</Link>
              </p>
            </div>
            <div id="nav-bar-icons">
              <div id="first-three-icons">
                <i className="fa fa-users" aria-hidden="true" onClick={this.showPendingRequests}></i>
                <i className="fa fa-comments" aria-hidden="true"></i>
                <i className="fa fa-globe" aria-hidden="true"></i>
              </div>
              <div className='question-icon-and-options'>
                <i className="fa fa-question" aria-hidden="true" id="question"></i>
                <i className="fa fa-bars" aria-hidden="true" onClick={this.showActionsContainer}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStatetoProps = (state, ownProps) => {
  return {
    currentUser: state.entities.users[state.session.currentUser.id],
    searchedUsers: state.entities.search
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideDropdown: () => dispatch(hideDropdown()),
    showDropdown: (comp) => dispatch(showDropdown(comp)),
    fetchSearchedUsers: input => dispatch(fetchSearchedUsers(input)),
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(NavBar));
