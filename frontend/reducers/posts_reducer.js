import { merge } from 'lodash';
import { RECEIVE_POST,
    FETCH_ALL_POSTS,
    UPDATE_POST,
    DELETE_POST,
    RECEIVE_ERRORS
  } from '../actions/posts_actions';
  import { normalize } from 'normalizr';
  import { postSchema, commentSchema, actionSchema } from '../util/schemas';


const preloadedState = {};

const postReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_POST:
    case FETCH_ALL_POSTS:
    case UPDATE_POST: {
      return merge({}, state, action.entities.posts);
    }
    case DELETE_POST: {

      return action.post;
    }
    default: {
      return state;
    }
  }
};

export default postReducer;
