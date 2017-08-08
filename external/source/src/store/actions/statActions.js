// Types
import { SET_STAT } from './types';

// Helpers
import { getStatPerUser } from './../../shared/ApiService';

export function getStatByUserID(token, user_id, date) {
  return dispatch => {
    getStatPerUser(token, user_id, date).then(resp => {
      if (resp.per_day)
        dispatch({
          type: SET_STAT,
          payload: {
            per_day: resp.per_day,
            per_status: resp.per_status,
            per_type_work: resp.per_type_work,
            per_projects: resp.per_projects,
            per_months: resp.per_months,
            history: resp.per_day,
            radar: resp.radar
          }
        });
    });
  };
}
