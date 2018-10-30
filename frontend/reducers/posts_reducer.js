import { merge } from 'lodash';
import {
  RECEIVE_POST,
  RECEIVE_POSTS,
  UPDATE_POST,
  DELETE_POST,
  RECEIVE_ERRORS
} from '../actions/posts_actions';

import {
  RECEIVE_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT
} from '../actions/comment_actions';

import { RECEIVE_LIKE, REMOVE_LIKE } from '../actions/like_actions';

const preloadedState = {};

const postReducer = (state = preloadedState, action) => {
  Object.freeze(state);
  let newState;
  let post;
  switch(action.type) {
    case RECEIVE_POST: {
      return Object.assign({}, state, { [action.post.id]: action.post });
    }
    case RECEIVE_POSTS: {
      return action.posts
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
      newState = Object.assign({}, state);
      delete newState[action.post.id];
      return newState;
    }
    case DELETE_COMMENT: {
      newState = Object.assign({}, state);
      const post = newState[action.comment.post_id];
      post.comments = post.comments.filter( comment => {
        return comment.id !== action.comment.id;
      });
      return newState;
    }
    case RECEIVE_LIKE: {
      if (!action.like.post_id) return state;
      newState = Object.assign({}, state);
      post = newState[action.like.post_id];
      post.likes.push(action.like.id);
      post.currentUserLikes = true;
      return newState;
    }
    case REMOVE_LIKE: {
      newState = Object.assign({}, state);
      post = newState[action.like.post_id];
      const idx = post.likes.indexOf(action.like.id);
      post.likes.splice(idx, 1);
      post.currentUserLikes = false;
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default postReducer;
