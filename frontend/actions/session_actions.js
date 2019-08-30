import * as APIUtil from '../util/session_api_util';
import { receiveErrors } from './errors_actions';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

export const receiveCurrentUser = currentUser => {
  return {
    type: RECEIVE_CURRENT_USER,
    user: currentUser
  };
};

export const signup = user => {
  return dispatch => {
    return APIUtil.signup(user).
      then(
        user => dispatch(receiveCurrentUser(user)),
        errors => {
          dispatch(receiveErrors([errors.responseJSON]));
        }
    );
  };
};

export const login = user => {
  return dispatch => {
    return APIUtil.login(user).
      then(
        user => dispatch(receiveCurrentUser(user)),
        errors => dispatch(receiveErrors(errors))
    );
  };
};


export const logout = () => {
  return dispatch => {
    return APIUtil.logout().
      then(() => dispatch(receiveCurrentUser(null)),
        errors => dispatch(receiveErrors(errors))
    );
  };
};
