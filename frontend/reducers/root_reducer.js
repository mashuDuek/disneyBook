
import SessionReducer from './session_reducer';
import PostReducer from './posts_reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    session: SessionReducer,
    posts: PostReducer
  }
);

export default rootReducer;
