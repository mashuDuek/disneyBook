import React from 'react';

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

export default DropdownComponent;
