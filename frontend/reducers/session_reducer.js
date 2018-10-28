import { merge } from 'lodash';
import {
  RECEIVE_CURRENT_USER,
} from '../actions/session_actions';

const preloadedState = { currentUser: null };

const sessionReducer = (state = preloadedState, action) => {
  Object.freeze(state);

  switch(action.type) {
    case RECEIVE_CURRENT_USER: {
      let newState = merge({}, state);
      newState.currentUser = action.user;
      return newState;
    }
    default: return state;
  }
};

export default sessionReducer;
