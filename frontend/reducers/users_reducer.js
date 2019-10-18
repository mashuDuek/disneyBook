import { merge } from 'lodash';
import { RECEIVE_USERS, RECEIVE_USER } from '../actions/user_actions';
import { RECEIVE_POST, RECEIVE_POSTS } from '../actions/posts_actions';
import { RECEIVE_COMMENTS } from '../actions/comment_actions';
import { RECEIVE_COVER_PIC } from '../actions/image_actions';
import { RECEIVE_CURRENT_USER } from '../actions/session_actions';

const preloadedState = {};

const userReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  let newState = Object.assign({}, state);
  switch(action.type) {
    case RECEIVE_COMMENTS:
    case RECEIVE_POSTS:
    case RECEIVE_USERS: {
      if (!action.users) return state;
      Object.values(action.users).forEach(user => {
        newState[user.id] = user;
      });
      return newState;
    }
    case RECEIVE_CURRENT_USER:
      const { user } = action;
      const newObj = user ? { [user.id]: user } : {};
      return Object.assign({}, state, newObj);
    case RECEIVE_USER: {
      const { user } = action;
      if (!user) return state;
      newState[user.id] = user;
      return newState;
    }
    case RECEIVE_POST:
      return Object.assign({}, state, action.users);
    default:
      return state;
  }
};

export default userReducer;
