import { SHOW_DROPDOWN, HIDE_DROPDOWN } from '../actions/dropdown_actions';

const dropdownReducer = (state = {}, action) => {
  switch(action.type) {
    case SHOW_DROPDOWN: {
      return {component: action.component};
    }
    case HIDE_DROPDOWN: {
      return {component: null};
    }
    default: return state;
  }
};

export default dropdownReducer;
