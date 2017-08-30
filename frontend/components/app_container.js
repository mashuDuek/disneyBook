import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import App from './App';
import { hideDropdown } from '../actions/dropdown_actions';

const mapStatetoProps = (state, ownProps) => {
  return {
    component: state.dropdowns.component,
    visible: Boolean(state.dropdowns.component)
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
