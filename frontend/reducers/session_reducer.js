import { RECEIVE_ERRORS, RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { merge } from 'lodash';


const preloadedState = { currentUser: null, errors: [] };

const sessionReducer = (state = preloadedState, action ) => {
  Object.freeze(state);

  switch(action.type) {
    case RECEIVE_CURRENT_USER: {
      let newState = merge({}, state);
      newState.currentUser = action.currentUser;
      return newState;
    }
    case RECEIVE_ERRORS: {
      let newState = merge({}, state);
      newState.errors = action.errors;
      return newState;
    }
    default: return state;
  }
};

export default sessionReducer;
