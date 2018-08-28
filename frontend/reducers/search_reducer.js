import { merge } from 'lodash';
import { RECEIVE_SEACH_RESULTS } from '../actions/user_actions';

const preloadedState = {};

const searchReducer = (state = preloadedState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_SEACH_RESULTS: {
      return action.users;
    }
    default:
      return state;
  }
};

export default searchReducer;
