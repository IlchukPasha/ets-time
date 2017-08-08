// Types
import {
  SET_ACTIVE_USER,
  SET_USERS,
  ME_FAILED,
  TOGGLE_CHANGE_USER,
  SET_POSITIONS,
  SET_ROLES
} from './../actions/types';

// Helpers
import { getInitNewUserData } from './../../shared/HelpService';

const initUserData = getInitNewUserData();
const initial = {
  roles: [],
  positions: [],
  projects: [],
  activeUser: {
    first_name: '',
    last_name: '',
    email: ''
  },
  userIsOpen: false,
  isUserCreate: false,
  users: [],
  meFailed: false,
  userData: initUserData
};

export default function userReducer(state = initial, action = {}) {
  switch (action.type) {
    case SET_ACTIVE_USER:
      return Object.assign({}, state, { activeUser: action.user });
    case SET_ROLES:
      return Object.assign({}, state, { roles: action.roles });
    case SET_POSITIONS:
      return Object.assign({}, state, { positions: action.positions });
    case SET_USERS:
      return Object.assign({}, state, { users: action.users });
    case ME_FAILED:
      return Object.assign({}, state, { meFailed: action.param });
    case TOGGLE_CHANGE_USER:
      return Object.assign({}, state, {
        userIsOpen: action.param,
        userData: action.data ? action.data : initUserData,
        isUserEdit: action.isUserEdit
      });

    default:
      return state;
  }
}
