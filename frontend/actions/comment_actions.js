import * as APIUtil from '../util/comment_util';

export const RECEIVE_COMMENT = 'RECEIVE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const FETCH_ALL_COMMENTS = 'FETCH_ALL_COMMENTS';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';

export const receiveComment = (comment) => {
  return {
    type: RECEIVE_COMMENT,
    comment: comment
  };
};

export const editComment = (comment) => {
  return {
    type: UPDATE_COMMENT,
    comment: comment
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
    type: FETCH_ALL_COMMENTS,
    comments
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
      (errors) => dispatch(receiveErrors({ comments }))
    );
  };
};


export const deleteComment = (comment) => {
  return (dispatch) => {
    return APIUtil.deleteComment(comment).
      then((comment) => dispatch(destroyComment(comment)),
      (errors) => dispatch(receiveErrors({ comments }))
    );
  };
};

export const fetchAllComments = () => {
  return (dispatch) => {
    return APIUtil.fetchAllComments().
      then((comments) => dispatch(fetchComments(comments)),
      (errors) => dispatch(receiveErrors({ comments }))
    );
  };
};
