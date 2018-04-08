import { merge } from 'lodash';
import { RECEIVE_POST,
    FETCH_ALL_POSTS,
    UPDATE_POST,
    DELETE_POST,
    RECEIVE_ERRORS
  } from '../actions/posts_actions';
  import { RECEIVE_COMMENT, DELETE_COMMENT } from '../actions/comment_actions';
  import { normalize } from 'normalizr';
  import { postSchema, commentSchema, actionSchema } from '../util/schemas';
  import values from 'lodash';


const preloadedState = {};

const postReducer = (state = preloadedState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_POST: {
      return Object.assign({}, state, { [action.post.id]: action.post });
    }
    case FETCH_ALL_POSTS:
    case RECEIVE_COMMENT:
    case UPDATE_POST: {
      return merge({}, state, action.posts);
    }
    case DELETE_POST: {
      return action.post;
    }
    case DELETE_COMMENT: {
      const newState = Object.assign({}, state);
      const post = newState[action.comment.post_id];
      post.comments = post.comments.filter((commentId) => {
        return commentId !== action.comment.id;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default postReducer;
