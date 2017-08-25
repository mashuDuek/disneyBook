import React from 'react';


class ModalComponent extends React.Component {
  render() {
    return(
      <div className='modal-background'>
        <div className="modal">
          {this.props.component}
        </div>
      </div>
    );
  }
}

export default ModalComponent;


// props here include hide(), component, visible
