import { merge } from 'lodash';
import { RECEIVE_USERS, RECEIVE_USER } from '../actions/user_actions';
import { RECEIVE_POST, RECEIVE_POSTS } from '../actions/posts_actions';
import { RECEIVE_COVER_PIC } from '../actions/image_actions';

const preloadedState = {};

const userReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  let newState = Object.assign({}, state);
  switch(action.type) {
    case RECEIVE_POSTS:
    case RECEIVE_USERS: {
      Object.values(action.users).forEach(user => {
        newState[user.id] = user;
      });
      return newState;
    }
    case RECEIVE_USER: {
      const newUsers = Object.assign({}, state, { [action.user.id]: action.user });
      return newUsers;
    }
    case RECEIVE_POST:
      return Object.assign({}, state, action.users);
    default:
      return state;
  }
};

export default userReducer;
