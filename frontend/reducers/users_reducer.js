import { merge } from 'lodash';
import { RECEIVE_USERS, RECEIVE_USER } from '../actions/user_actions';

const preloadedState = {};

const userReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_USERS: {
      return action.users;
    }
    case RECEIVE_USER: {
      return action.user;
    }
    default: return state;
  }
};

export default userReducer;
