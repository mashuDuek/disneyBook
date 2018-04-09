import { hideModal } from '../../actions/modal_actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ModalComponent from './modal_component';

const mapStatetoProps = (state, ownProps) => {
  return {
    component: state.ui.modals.component,
    visible: Boolean(state.ui.modals.component)
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
)(ModalComponent));
