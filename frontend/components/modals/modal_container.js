import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ModalComponent from './modal_component';
import { hideModal } from '../../actions/modal_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    component: state.modals.component,
    visible: Boolean(state.modals.component)
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
