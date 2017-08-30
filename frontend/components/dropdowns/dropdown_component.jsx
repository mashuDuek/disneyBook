import React from 'react';

class DropdownComponent extends React.Component {
  render() {

    if (!this.props.component) {
      return null;
    } else {
      return(
        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
        </div>
      );
    }
  }
}

export default DropdownComponent;
