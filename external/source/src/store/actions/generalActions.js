// Types
import {
  CHANGE_BG_COLOR,
  CLEAR_ERROR_FIELD,
  SET_ERRORS,
  CLEAR_ERRORS,
  TOGGLE_CONFIRM,
  SET_TOKEN,
  TOGGLE_STATISTIC
} from './../actions/types';

export function changeBgColor(color) {
  return {
    type: CHANGE_BG_COLOR,
    color
  };
}

export function clearErrorField(field) {
  return {
    type: CLEAR_ERROR_FIELD,
    field
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors
  };
}

export function toggleStatistic(param) {
  return {
    type: TOGGLE_STATISTIC,
    param
  };
}

export function clearErrors() {
  return {
    type: CLEAR_ERRORS
  };
}

export function toggleConfirm(confirmIsOpen, text, action, param) {
  return {
    type: TOGGLE_CONFIRM,
    data: { text, action, param },
    confirmIsOpen
  };
}

export function setToken(token) {
  return {
    type: SET_TOKEN,
    token
  };
}
