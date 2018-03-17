import { merge } from 'lodash';
import { RECEIVE_USERS, RECEIVE_USER } from '../actions/user_actions';
import { FETCH_ALL_POSTS, RECEIVE_POST } from '../actions/posts_actions';
import { RECEIVE_COVER_PIC } from '../actions/image_actions';

const preloadedState = {};

const userReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_USERS: {
      const newState = Object.assign({}, state);
      Object.keys(action.users).forEach((id) => {
        newState[id] = action.users[id];
      });
      return newState;
    }
    case RECEIVE_USER: {
      return Object.assign({}, state, { [action.user.id]: action.user });
    }
    case RECEIVE_POST:
      return Object.assign({}, state, action.users);
    default:
      return state;
  }
};

export default userReducer;
