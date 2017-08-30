import React from 'react';

class ModalComponent extends React.Component {
  render() {
    if (!this.props.component) {
      return null;
    } else {
      return(
        <div className='modal-backdrop' onClick={this.props.hide}>
          <div className="modal">
            {this.props.component}
          </div>
        </div>
      );
    }
  }
}

export default ModalComponent;
