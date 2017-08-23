import { merge } from 'lodash';
import { RECEIVE_USERS } from '../actions/user_actions';

const preloadedState = { errors: [] };

const userReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_USERS: {
      return action.users;
    }
    default: return state;
  }
};

export default userReducer;
