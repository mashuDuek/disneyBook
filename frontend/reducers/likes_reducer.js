import { merge } from 'lodash';
import { RECEIVE_LIKE, REMOVE_LIKE } from '../actions/like_actions';

const preloadedState = {};

const likesReducer = (state = preloadedState, action) => {
  Object.freeze(state);
  let newState;
  switch(action.type) {
    case RECEIVE_LIKE: {
      return action.like;
    }
    default: {
      return state;
    }
  }
};

export default likesReducer;
