import { SHOW_MODAL, HIDE_MODAL } from '../actions/modal_actions';

const modalReducer = (state = {}, action) => {
  switch(action.type) {
    case SHOW_MODAL: {
      return {component: action.component};
    }
    case HIDE_MODAL: {
      return {component: null};
    }
    default: return state;
  }
};

export default modalReducer;
