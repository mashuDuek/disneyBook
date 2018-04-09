import SessionReducer from './session_reducer';
import PostReducer from './posts_reducer';
import UserReducer from './users_reducer';
import ModalReducer from './modals_reducer';
import DropdownReducer from './dropdowns_reducer';
import ErrorsReducer from './errors_reducer';
import entitiesReducer from './entities_reducer';
import uiReducer from './ui_reducer';
import likesReducer from './ui_reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    session: SessionReducer,
    entities: entitiesReducer,
    ui: uiReducer
  }
);

export default rootReducer;
