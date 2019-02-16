import * as APIUtil from '../util/friendship_util';
import { receiveCurrentUser } from './session_actions';
import { receiveUsers } from './user_actions';

export const createFriendship = (user) => {
  return (dispatch) => {
    return APIUtil.createFriendship(user).
      then((user) => {
        dispatch(receiveUsers(user.acceptedFriendIds));
        dispatch(receiveUsers(user.pendingFriendIds));
        dispatch(receiveCurrentUser(user));
      }
    );
  };
};

export const acceptFriendship = (user) => {
  return (dispatch) => {
    return APIUtil.acceptFriendship(user).
      then((user) => dispatch(receiveCurrentUser(user))
    );
  };
};

export const rejectFriendship = (user) => {
  return (dispatch) => {
    return APIUtil.rejectFriendship(user).
      then((user) => dispatch(receiveCurrentUser(user))
    );
  };
};
