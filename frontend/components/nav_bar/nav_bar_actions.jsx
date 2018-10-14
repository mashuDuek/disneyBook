import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hideDropdown } from '../../actions/dropdown_actions';
import { logout } from '../../actions/session_actions';

class NavBarActions extends React.Component {
  constructor (props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.logout().then(this.props.hideDropdown);
  }

  render() {
    return(
      <div id='nav-bar-actions'>
        <ul>
          <li>
            <button onClick={this.handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideDropdown: () => dispatch(hideDropdown()),
    logout: () => dispatch(logout())
  };
};

export default withRouter(connect(
  null,
  mapDispatchToProps
)(NavBarActions));
