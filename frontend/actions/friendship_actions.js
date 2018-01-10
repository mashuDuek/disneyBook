import * as APIUtil from '../util/friendship_util';
import { receiveCurrentUser } from './session_actions';
import { receiveUsers } from './user_actions';

// export const RECEIVE_FRIENDSHIP = 'RECEIVE_FRIENDSHIP';
// export const ACCEPT_FRIENDSHIP = 'ACCEPT_FRIENDSHIP';
// export const REJECT_FRIENDSHIP = 'REJECT_FRIENDSHIP';
// export const editFriendship = (user) => {
//   return {
//     type: ACCEPT_FRIENDSHIP,
//     user: user
//   };
// };
// export const makeFriendship = (user) => {
//   return {
//     type: RECEIVE_FRIENDSHIP,
//     user: user
//   };
// };
// export const denyFriendship = (user) => {
//   return {
//     type: REJECT_FRIENDSHIP,
//     user: user
//   };
// };

// below, user is currentUser
export const createFriendship = (user) => {
  return (dispatch) => {
    return APIUtil.createFriendship(user).
      then((user) => {
        dispatch(receiveUsers(user.acceptedFriends));
        dispatch(receiveUsers(user.pendingFriends));

        // const pending = user.pendingFriends;
        // const accepted = user.acceptedFriends;
        // delete user.pendingFriends;
        // delete user.acceptedFriends;
        // user.pending_friend_ids = pending.map((user) => {
        //   return user.id;
        // });
        // user.accepted_friend_ids = accepted.map((user) => {
        //   return user.id;
        // });

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
