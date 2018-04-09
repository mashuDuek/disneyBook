import { hideDropdown } from '../actions/dropdown_actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import App from './App';

const mapStatetoProps = (state, ownProps) => {
  return {
    component: state.ui.dropdowns.component,
    visible: Boolean(state.ui.dropdowns.component)
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
)(App));
