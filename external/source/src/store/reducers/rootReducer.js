import { combineReducers } from 'redux';

import trackReducer from './trackReducer';
import userReducer from './userReducer';
import generalReducer from './generalReducer';
import statReducer from './statReducer';

export default combineReducers({
  trackReducer,
  userReducer,
  generalReducer,
  statReducer
});
