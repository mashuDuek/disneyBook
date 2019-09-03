import * as APIUtil from '../util/user_util';
import { receiveErrors } from './errors_actions';

export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';
export const RECEIVE_SEACH_RESULTS = 'RECEIVE_SEACH_RESULTS';

export const receiveUsers = (users) => {
  return {
    type: RECEIVE_USERS,
    users: users
  };
};

export const receiveSearchResults = users => {
  return {
    type: RECEIVE_SEACH_RESULTS,
    users
  };
};

export const receiveUser = (user) => {
  return {
    type: RECEIVE_USER,
    user
  };
};

export const fetchUsers = () => {
  return (dispatch) => {
    return APIUtil.fetchUsers().
      then((users) => dispatch(receiveUsers(users)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

export const fetchUser = (id) => {
  return (dispatch) => {
    return APIUtil.fetchUser(id).
      then((user) => dispatch(receiveUser(user)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};

export const fetchSearchedUsers = input => {
  return dispatch => {
    return APIUtil.searchUsers(input).
      then(users => dispatch(receiveSearchResults(users)),
      (errors) => dispatch(receiveErrors(errors))
    );
  };
};
