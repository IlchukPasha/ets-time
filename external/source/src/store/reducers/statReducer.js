// Types
import { SET_STAT } from './../actions/types';

const initial = {
  per_day: [],
  per_status: [],
  per_months: [],
  per_type_work: [],
  per_projects: [],
  history: [],
  radar: []
};

export default function userReducer(state = initial, action = {}) {
  switch (action.type) {
    case SET_STAT:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
