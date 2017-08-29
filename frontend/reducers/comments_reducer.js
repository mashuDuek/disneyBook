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

      return Object.assign({}, state, action.entities.comments);
      // const newComment = action.entities.comments[action.result];
      // return merge({}, state, newComment);
      // return Object.assign({}, state, action.entities.comments);

    }
      // console.log(postSchema, commentSchema, normalize);
      // const normalizedPost = normalize(action, actionSchema);
      // const newComments = {};
      // action.comments.map((comment) => {
      //   delete comment.author;
      //   newComments[comment.id] = comment;
      // });
      // return merge({}, state, newComments);
      //
      // return Object.assign({}, state, action.entities.comments);


    //   debugger
    //   return merge({}, state, { [action.comment.id]: action.comment });
    // }
    case DELETE_COMMENT: {
      return action.comment;
    }
    default: {
      return state;
    }
  }
};

export default commentReducer;
