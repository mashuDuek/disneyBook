import { RECEIVE_ERRORS } from '../actions/errors_actions';

const preloadedState = {
  errors: {
    users: [],
    posts: [],
    session: [],
    comments: [],
  }
};

const errorsReducer = (state = preloadedState, action) => {

  switch(action.type) {
    case RECEIVE_ERRORS: {
      return action.errors;
    }
    default: return state;
  }
};


export default errorsReducer;
