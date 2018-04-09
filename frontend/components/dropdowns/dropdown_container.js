import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DropdownComponent from './dropdown_component';

const mapStatetoProps = (state, ownProps) => {
  return {
    component: state.ui.dropdowns.component,
    visible: Boolean(state.ui.dropdowns.component)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

export default withRouter(connect(
  mapStatetoProps,
  null
)(DropdownComponent));
