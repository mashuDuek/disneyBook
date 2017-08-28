import SessionReducer from './session_reducer';
import PostReducer from './posts_reducer';
import UserReducer from './users_reducer';
import ModalReducer from './modals_reducer';
import ErroresReducer from './errors_reducer';
import CommentsReducer from './comments_reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    session: SessionReducer,
    posts: PostReducer,
    users: UserReducer,
    modals: ModalReducer,
    comments: CommentsReducer,
    errors: ErroresReducer,
  }
);

export default rootReducer;
