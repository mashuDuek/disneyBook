import * as APIUtil from '../util/like_util';
import { receiveErrors } from './errors_actions';

export const RECEIVE_LIKE = 'RECEIVE_LIKE';
export const REMOVE_LIKE = 'REMOVE_LIKE';

export const receiveLike = (like) => {
  return {
    type: RECEIVE_LIKE,
    like
  };
};

export const removeLike = (like) => {
  return {
    type: REMOVE_LIKE,
    like
  };
};

export const createLike = (like) => {
  return (dispatch) => {
    return APIUtil.createLike(like).
      then((like) => dispatch(receiveLike(like)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

export const deleteLike = (like) => {
  return (dispatch) => {
    return APIUtil.deleteLike(like).
      then((like) => dispatch(removeLike(like)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};
