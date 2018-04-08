import { merge } from 'lodash';
import {
  RECEIVE_POST,
  FETCH_ALL_POSTS,
  UPDATE_POST,
  DELETE_POST,
  RECEIVE_ERRORS
} from '../actions/posts_actions';

import {
  RECEIVE_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT
} from '../actions/comment_actions';

const preloadedState = {};

const postReducer = (state = preloadedState, action) => {
  Object.freeze(state);
  let newState;
  switch(action.type) {
    case RECEIVE_POST: {
      return Object.assign({}, state, { [action.post.id]: action.post });
    }
    case FETCH_ALL_POSTS: {
      newState = Object.assign({}, state);
      action.posts.map(post => newState[post.id] = post);
      return newState;
    }
    case RECEIVE_COMMENT:
    case UPDATE_COMMENT:
      newState = Object.assign({}, state);
      const comments = newState[action.comment.post_id].comments;
      const newComments = comments.map( comment => {
        if (comment.id === action.comment.id) return action.comment;
        return comment;
      });
      newState[action.comment.post_id].comments = newComments;
      return newState;

    case UPDATE_POST: {
      return Object.assign({}, state, { [action.post.id]: action.post });
    }
    case DELETE_POST: {
      return action.post;
    }
    case DELETE_COMMENT: {
      newState = Object.assign({}, state);
      const post = newState[action.comment.post_id];
      post.comments = post.comments.filter( comment => {
        return comment.id !== action.comment.id;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default postReducer;
