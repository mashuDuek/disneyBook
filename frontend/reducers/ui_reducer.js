import { merge } from 'lodash';
import { RECEIVE_USERS, RECEIVE_USER } from '../actions/user_actions';
import { FETCH_ALL_POSTS, RECEIVE_POST } from '../actions/posts_actions';
import { RECEIVE_COVER_PIC } from '../actions/image_actions';

const preloadedState = {};

const uiReducer = (state = preloadedState, action ) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_USER: {
      return { currentUserProfile: action.user};
    }
    default:
      return state;
  }
};

export default uiReducer;
