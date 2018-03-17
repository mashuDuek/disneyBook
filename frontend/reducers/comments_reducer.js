import { merge } from 'lodash';
import { RECEIVE_COMMENT,
    FETCH_ALL_COMMENTS,
    UPDATE_COMMENT,
    DELETE_COMMENT,
    RECEIVE_ERRORS
  } from '../actions/comment_actions';

import { FETCH_ALL_POSTS } from '../actions/posts_actions';

const preloadedState = {};

const commentReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  switch(action.type) {
    case FETCH_ALL_POSTS:
    case RECEIVE_COMMENT:
    case FETCH_ALL_COMMENTS:
    case UPDATE_COMMENT: {
      return Object.assign({}, state, action.comments);
    }
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
