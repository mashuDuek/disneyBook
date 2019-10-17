import { RECEIVE_ERRORS } from '../actions/errors_actions';

const preloadedState = {};

const errorsReducer = (state = preloadedState, action) => {
  switch(action.type) {
    case RECEIVE_ERRORS: {
      return action.errors.responseJSON;
    }
    default: return state;
  }
};

export default errorsReducer;
