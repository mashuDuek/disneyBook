import { merge } from 'lodash';
import { RECEIVE_POST,
    FETCH_ALL_POSTS,
    UPDATE_POST,
    DELETE_POST,
    RECEIVE_ERRORS,
    RECEIVE_USERS
  } from '../actions/posts_actions';

const preloadedState = { errors: [] };

const postReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_POST: {
      const newPost = { [action.post.id]: action.post };
      return merge({}, state, newPost);
    }
    case FETCH_ALL_POSTS: {
      action.posts.map((post) => {
        delete post.author;
      });
      return merge({}, state, action.posts);
    }
    case UPDATE_POST: {
      return merge({}, state, action.post);
    }
    case RECEIVE_ERRORS: {
      let newState = merge({}, state);
      newState.errors = action.errors;
      return newState;
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
