import { each } from 'lodash';
// Api services
import {
  getTracksApi,
  getDictionariesApi,
  createTrackApi,
  deleteTrackApi,
  updateTrackApi,
  changeTrackStatusApi
} from './../../shared/ApiService';

// Actions
import { setErrors, toggleConfirm } from './generalActions';

// Constants
import {
  SET_TRACKS,
  TOGGLE_CHANGE_TRACK,
  TOGGLE_TRACK_FILTERS,
  SET_WORK_TYPES,
  SET_STATUS_TYPES,
  SET_TRACK_FILTER,
  CLEAR_TRACK_FILTERS,
  CHANGE_TRACK_VIEW,
  SET_ROLES,
  SET_POSITIONS,
  SET_PROJECTS
} from './types';

// Helpers
import { getInitFiltersForTrack } from './../../shared/HelpService';

export function getTracks(token, filters = getInitFiltersForTrack()) {
  return dispatch => {
    getTracksApi(token, filters).then(resp => {
      if (resp.data) dispatch(setTracks(resp.data));
    });
  };
}

export function setVars(vars) {
  return dispatch => {
    let newPayload = {};
    each(vars, (item, key) => {
      newPayload[key] = item;
    });
    dispatch({ type: 'NEED_UPD_LIST', payload: newPayload });
  };
}

export function changeTrackStatus(token, id, status) {
  return dispatch => {
    changeTrackStatusApi(token, id, status).then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        dispatch({ type: 'NEED_UPD_LIST', payload: { _need_upd_list: true } });
      }
    });
  };
}

export function removeTrack(id, token) {
  return dispatch => {
    deleteTrackApi(id, token).then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        dispatch({ type: 'NEED_UPD_LIST', payload: { _need_upd_list: true } });
        dispatch(toggleConfirm(false, 'text'));
      } else {
        dispatch(setErrors({ deleteTrack: true }));
      }
    });
  };
}

export function createTrack(data, token) {
  return dispatch => {
    createTrackApi(data, token).then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(getTracks(token));
        dispatch(toggleChangeTrack(false));
      } else {
        if (resp.status === 404) {
          dispatch(setErrors({ changeTrackError: true }));
        } else {
          resp.json().then(resp => {
            dispatch(setErrors(resp.errors));
          });
        }
      }
    });
  };
}

export function updateTrack(data, token) {
  return dispatch => {
    updateTrackApi(data, token).then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        dispatch({ type: 'NEED_UPD_LIST', payload: { _need_upd_list: true } });
        dispatch(toggleChangeTrack(false));
      } else {
        if (resp.status === 404) {
          dispatch(setErrors({ changeTrackError: true }));
        } else {
          resp.json().then(resp => {
            dispatch(setErrors(resp.errors));
          });
        }
      }
    });
  };
}

export function getLibraries(token, onlyProjects) {
  return dispatch => {
    getDictionariesApi(token).then(resp => {
      if (resp) {
        if (onlyProjects) {
          dispatch(setProjects(resp.projects));
        } else {
          dispatch(setWorkTypes(resp.type_works));
          dispatch(setStatusTypes(resp.task_status));
          dispatch(setRoles(resp.roles));
          dispatch(setPositions(resp.positions));
          dispatch(setProjects(resp.projects));
        }
      }
    });
  };
}

export function clearTrackFilters() {
  return {
    type: CLEAR_TRACK_FILTERS
  };
}

export function toggleChangeTrack(param, isTrackEdit, data) {
  return {
    type: TOGGLE_CHANGE_TRACK,
    data,
    isTrackEdit,
    param
  };
}

export function toggleTrackFilters() {
  return {
    type: TOGGLE_TRACK_FILTERS
  };
}

export function setTrackFilters(filters) {
  return {
    type: SET_TRACK_FILTER,
    filters
  };
}

export function changeTrackView(view) {
  return {
    type: CHANGE_TRACK_VIEW,
    view
  };
}

function setTracks(tracks) {
  return {
    type: SET_TRACKS,
    tracks
  };
}

function setWorkTypes(workTypes) {
  return {
    type: SET_WORK_TYPES,
    workTypes
  };
}

function setRoles(roles) {
  return {
    type: SET_ROLES,
    roles
  };
}

function setPositions(positions) {
  return {
    type: SET_POSITIONS,
    positions
  };
}
function setProjects(projects) {
  return {
    type: SET_PROJECTS,
    projects
  };
}

function setStatusTypes(statusTypes) {
  return {
    type: SET_STATUS_TYPES,
    statusTypes
  };
}
