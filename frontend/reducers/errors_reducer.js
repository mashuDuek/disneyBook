import { RECEIVE_ERRORS } from '../actions/posts_actions';
// import { RECEIVE_ERRORS } from '../actions/posts_actions';
// import { RECEIVE_ERRORS } from '../actions/posts_actions';

//  do I need to import the same (RECEIVE_ERRORS) from all other actions ? ? ?

const preloadedState = {
  errors: {
    users: [],
    posts: [],
    session: [],
  }
};

const errorsReducer = (state = preloadedState, action) => {
  debugger
  switch(action.type) {
    case RECEIVE_ERRORS: {
      return action.errors;
    }
    default: return state;
  }
};


export default errorsReducer;
