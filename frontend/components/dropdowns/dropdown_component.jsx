import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { hideDropdown } from '../../actions/dropdown_actions';

class DropdownComponent extends React.Component {
  render() {
    if (!this.props.component) {
      return null;
    } else {
      return(
        <div className="dropdown-backdrop" onClick={this.props.hideDropdown}>
          <div
            className="dropdown"
            onClick={(e) => e.stopPropagation()}>
            {this.props.component}
          </div>
        </div>
      );
    }
  }
}

const mapStatetoProps = (state, ownProps) => {
  return {
    component: state.ui.dropdowns.component,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hideDropdown: () => dispatch(hideDropdown())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(DropdownComponent));
