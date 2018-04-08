import { merge } from 'lodash';
import {
  RECEIVE_COMMENT,
  RECEIVE_COMMENTS,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  RECEIVE_ERRORS
} from '../actions/comment_actions';

import { FETCH_ALL_POSTS } from '../actions/posts_actions';

const preloadedState = {};

const commentReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_COMMENT:
    case UPDATE_COMMENT: {
      return Object.assign({}, state, { [action.comment.id]: action.comment });
    }
    case RECEIVE_COMMENTS:
      return action.comments;
    case DELETE_COMMENT: {
      const newState = Object.assign({}, state);
      delete newState[action.comment.id];
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default commentReducer;
