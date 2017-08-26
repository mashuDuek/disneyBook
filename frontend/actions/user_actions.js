import * as APIUtil from '../util/user_util';

export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';

export const receiveUsers = (users) => {
  return {
    type: RECEIVE_USERS,
    users: users
  };
};

export const receiveErrors = (errors) => {
  return {
    type: RECEIVE_ERRORS,
    errors: errors
  };
};

export const fetchUsers = () => {
  return (dispatch) => {
    return APIUtil.fetchUsers().
      then((users) => dispatch(receiveUsers(users)),
      (errors) => dispatch(receiveErrors({ users }))
    );
  };
};
