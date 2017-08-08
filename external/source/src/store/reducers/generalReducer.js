import {
  CHANGE_BG_COLOR,
  SET_ERRORS,
  CLEAR_ERROR_FIELD,
  CLEAR_ERRORS,
  TOGGLE_CONFIRM,
  SET_TOKEN,
  TOGGLE_STATISTIC
} from './../actions/types';

const bgColor = localStorage.getItem('bdColor');
const showStatistic = localStorage.getItem('showStatistic');
const initial = {
  bgColor: bgColor ? bgColor : 'deepskyblue',
  errors: {},
  token: false,
  confirmIsOpen: false,
  showStatistic: showStatistic ? showStatistic === 'true' : true,
  confirmData: {
    text: 'text',
    action: '',
    param: ''
  }
};

export default function userReducer(state = initial, action = {}) {
  switch (action.type) {
    case CHANGE_BG_COLOR:
      return Object.assign({}, state, { bgColor: action.color });
    case TOGGLE_STATISTIC:
      return Object.assign({}, state, {
        showStatistic: action.param
      });
    case SET_TOKEN:
      return Object.assign({}, state, { token: action.token });
    case TOGGLE_CONFIRM:
      return Object.assign({}, state, {
        confirmIsOpen: action.confirmIsOpen,
        confirmData: action.data ? action.data : state.confirmData,
        errors: {}
      });
    case CLEAR_ERRORS:
      return Object.assign({}, state, { errors: {} });
    case SET_ERRORS:
      return Object.assign({}, state, { errors: action.errors });
    case CLEAR_ERROR_FIELD:
      return Object.assign({}, state, {
        errors: Object.assign({}, state.errors, { [action.field]: undefined })
      });
    default:
      return state;
  }
}
