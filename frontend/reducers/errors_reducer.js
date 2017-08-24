import { RECEIVE_ERRORS } from '../actions/posts_actions';
// import { RECEIVE_ERRORS } from '../actions/posts_actions';
// import { RECEIVE_ERRORS } from '../actions/posts_actions';

//  do I need to import the same (RECEIVE_ERRORS) from all other actions ? ? ?


preloadedState = { errors: [] };
const errorsReducer = (state = preloadedState, action) => {
  switch(action.type) {

    case RECEIVE_ERRORS: {
      let newState = merge({}, state);
      newState.errors = action.errors;
      return newState;
    }
  }
};


export default errorsReducer;
