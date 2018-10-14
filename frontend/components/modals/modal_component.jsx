import React from 'react';
import { hideModal } from '../../actions/modal_actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Modal extends React.Component {
  render() {
    if (!this.props.component) {
      return null;
    } else {
      return(
        <div id="modal-backdrop" className='modal-backdrop' onClick={this.props.hide}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {this.props.component}
          </div>
        </div>
      );
    }
  }
}

const mapStatetoProps = (state, ownProps) => {
  return {
    component: state.ui.modals.component,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    hide: () => dispatch(hideModal())
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(Modal));