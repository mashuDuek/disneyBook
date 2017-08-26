import { RECEIVE_ERRORS, RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { merge } from 'lodash';


const preloadedState = { currentUser: null };

const sessionReducer = (state = preloadedState, action ) => {
  Object.freeze(state);

  switch(action.type) {
    case RECEIVE_CURRENT_USER: {
      let newState = merge({}, state);
      newState.currentUser = action.currentUser;
      return newState;
    }
    default: return state;
  }
};

export default sessionReducer;
