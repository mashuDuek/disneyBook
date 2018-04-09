import ModalReducer from './modals_reducer';
import DropdownReducer from './dropdowns_reducer';
import ErrorsReducer from './errors_reducer';
import { combineReducers } from 'redux';

const uiReducer = combineReducers({
  dropdowns: DropdownReducer,
  errors: ErrorsReducer,
  modals: ModalReducer,
});

export default uiReducer;
