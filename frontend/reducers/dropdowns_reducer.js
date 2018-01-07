import { SHOW_DROPDOWN,
  HIDE_DROPDOWN,
  DISPLAY_DROPDOWN
} from '../actions/dropdown_actions';

const dropdownReducer = (state = {}, action) => {
  switch(action.type) {
    case SHOW_DROPDOWN: {
      return {component: action.component};
    }
    case HIDE_DROPDOWN: {
      return {component: null, displayed: null};
    }
    case DISPLAY_DROPDOWN: {
      return {displayed: action.displayed};
    }
    default: return state;
  }
};

export default dropdownReducer;
