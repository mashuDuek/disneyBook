import * as APIUtil from '../util/comment_util';
import { normalize, schema } from 'normalizr';
import { commentSchema } from '../util/schemas';

export const RECEIVE_COMMENT = 'RECEIVE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const FETCH_ALL_COMMENTS = 'FETCH_ALL_COMMENTS';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';

export const receiveComment = (comment) => {
  return {
    type: RECEIVE_COMMENT,
    ...normalize(comment, commentSchema)
  };
};

export const editComment = (comment) => {
  return {
    type: UPDATE_COMMENT,
    ...normalize(comment, commentSchema)
  };
};

export const destroyComment = (comment) => {
  debugger
  return {
    type: DELETE_COMMENT,
    comment: comment
  };
};

export const fetchComments = (comments) => {
  return {
    type: FETCH_ALL_COMMENTS,
    ...normalize(comments, new schema.Array(commentSchema))
  };
};

export const receiveErrors = (errors) => {
  return {
    type: RECEIVE_ERRORS,
    errors: errors
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
  debugger
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
