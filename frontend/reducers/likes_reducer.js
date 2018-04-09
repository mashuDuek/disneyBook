import { merge } from 'lodash';
import { RECEIVE_LIKE, REMOVE_LIKE } from '../actions/like_actions';

const preloadedState = {};

const LikesReducer = (state = preloadedState, action) => {
  Object.freeze(state);
  let newState;
  switch(action.type) {
    case RECEIVE_LIKE: {
      return Object.assign({}, state, { [action.like.id]: action.like });
    }
    case REMOVE_LIKE: {
      newState = Object.assign({}, state);
      delete newState[action.like.id];
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default LikesReducer;
