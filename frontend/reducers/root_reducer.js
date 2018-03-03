import SessionReducer from './session_reducer';
import PostReducer from './posts_reducer';
import UserReducer from './users_reducer';
import ModalReducer from './modals_reducer';
import DropdownReducer from './dropdowns_reducer';
import ErrorsReducer from './errors_reducer';
import CommentsReducer from './comments_reducer';
import uiReducer from './ui_reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    session: SessionReducer,
    posts: PostReducer,
    users: UserReducer,
    modals: ModalReducer,
    dropdowns: DropdownReducer,
    comments: CommentsReducer,
    errors: ErrorsReducer,
    ui: uiReducer
  }
);

export default rootReducer;
