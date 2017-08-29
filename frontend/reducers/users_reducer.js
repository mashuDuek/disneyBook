import { merge } from 'lodash';
import { RECEIVE_USERS, RECEIVE_USER } from '../actions/user_actions';
import { FETCH_ALL_POSTS, RECEIVE_POST } from '../actions/posts_actions';

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
    case FETCH_ALL_POSTS:
    case RECEIVE_POST:
      return Object.assign({}, state, action.entities.users);
    default: return state;
  }
};

export default userReducer;
