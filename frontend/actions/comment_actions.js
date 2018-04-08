import * as APIUtil from '../util/comment_util';
import { normalize, schema } from 'normalizr';
import { commentSchema } from '../util/schemas';
import { receiveErrors } from './errors_actions';

export const RECEIVE_COMMENT = 'RECEIVE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';

export const receiveComment = (comment) => {
  return {
    type: RECEIVE_COMMENT,
    comment
  };
};

export const editComment = (comment) => {
  return {
    type: UPDATE_COMMENT,
    comment
  };
};

export const destroyComment = (comment) => {
  return {
    type: DELETE_COMMENT,
    comment: comment
  };
};

export const fetchComments = (comments) => {
  return {
    type: RECEIVE_COMMENTS,
    comments
  };
};

export const createComment = (comment) => {
  return (dispatch) => {
    return APIUtil.createComment(comment).
      then((comment) => dispatch(receiveComment(comment)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

export const updateComment = (comment) => {
  return (dispatch) => {
    return APIUtil.updateComment(comment).
      then((comment) => dispatch(editComment(comment)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

export const deleteComment = (comment) => {
  return (dispatch) => {
    return APIUtil.deleteComment(comment).
      then((comment) => dispatch(destroyComment(comment)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

export const fetchAllComments = () => {
  return (dispatch) => {
    return APIUtil.fetchAllComments().
      then((comments) => dispatch(fetchComments(comments)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};
