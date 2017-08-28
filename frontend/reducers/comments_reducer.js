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
      // old bad stuff
      // const { posts } = action;
      // const newComments = {};
      // posts.forEach(post =>{
      //   post.comments.forEach(comment => {
      //     Object.assign(newComments, { comment.id: comment})
      //   })
      // })
      return Object.assign({}, state, action.entities.comments);
    case RECEIVE_COMMENT: {
      const newComment = { [action.comment.id]: action.comment };
      return merge({}, state, newComment);
    }
    case FETCH_ALL_COMMENTS: {
      console.log(postSchema, commentSchema, normalize);
      const normalizedPost = normalize(action, actionSchema);

      debugger
      const newComments = {};
      action.comments.map((comment) => {
        delete comment.author;
        newComments[comment.id] = comment;
      });
      return merge({}, state, newComments);
    }
    case UPDATE_COMMENT: {
      return merge({}, state, { [action.comment.id]: action.comment });
    }
    case DELETE_COMMENT: {
      return action.comment;
    }
    default: {
      return state;
    }
  }
};

export default commentReducer;
