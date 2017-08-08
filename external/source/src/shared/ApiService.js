import { parseJSON, formatDateToServer } from './HelpService';

export function getStatPerUser(token, user_id, date) {
  return fetch('/api/v1/stat/' + user_id + '?month=' + date, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  }).then(parseJSON);
}

export function getDictionariesApi(token) {
  return fetch('/api/v1/dictionaries', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  }).then(parseJSON);
}

export function deleteTrackApi(id, token) {
  return fetch('/api/v1/lines', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      id,
      user_id: 1
    })
  });
}

export function createTrackApi(data, token) {
  let { project = '', task = '', type_work = '', hours = 0, trackDate } = data;

  return fetch('/api/v1/lines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      project,
      task,
      type_work: type_work.value ? type_work.value : type_work,
      hours,
      date_task: trackDate ? trackDate.format('YYYY-MM-DD') : ''
    })
  });
}

export function createUserApi(data, token) {
  let {
    first_name = '',
    last_name = '',
    email = '',
    roles = '',
    position = '',
    rate = 0,
    password = ''
  } = data;

  return fetch('/api/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      roles,
      position,
      rate,
      password
    })
  });
}

export function updateUserApi(data, token, status) {
  let {
    first_name = '',
    last_name = '',
    roles = [],
    position = [],
    rate = 0,
    id = ''
  } = data;

  let locked = status === 1 ? 1 : 0;
  let userObj = {
    first_name,
    last_name,
    roles,
    position,
    rate,
    id,
    locked
  };

  if (data.password) {
    userObj.password = data.password;
  }

  return fetch('/api/v1/users', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify(userObj)
  });
}

export function updateTrackApi(data, token) {
  let {
    id = '',
    project = '',
    task = '',
    type_work = '',
    hours = 0,
    trackDate
  } = data;

  return fetch('/api/v1/lines', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      id,
      project,
      task,
      type_work: type_work.value ? type_work.value : type_work,
      hours,
      date_task: trackDate ? trackDate.format('YYYY-MM-DD') : ''
    })
  });
}

export function getTracksApi(token, filters) {
  let {
    type_work = '',
    status = '',
    project = '',
    task = '',
    startDate = '',
    endDate = '',
    user = ''
  } = filters ? filters : {};

  let sDate = startDate ? formatDateToServer(startDate) : '';
  let eDate = endDate ? formatDateToServer(endDate) : '';

  return fetch(
    `/api/v1/lines?project=${project ? project : ''}&user=${user ? user : ''}&date_start=${startDate ? sDate : ''}&date_end=${endDate ? eDate : ''}&status=${status ? status : ''}&type_work=${type_work ? type_work : ''}&task=${task}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      }
    }
  ).then(parseJSON);
}

export function changeTrackStatusApi(token, id, status) {
  return fetch('/api/v1/lines/status', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      id,
      status
    })
  });
}

export function getUsersApi(token) {
  return fetch('/api/v1/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  }).then(parseJSON);
}

export function getAllSkillsApi(token) {
  return fetch('/api/v1/skills', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  }).then(parseJSON);
}

export function getSkillsFromUserApi(token, user_id) {
  return fetch(`/api/v1/skills/${user_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  }).then(parseJSON);
}

export function attachSkillUser(token, { user_id, skill_id, value }) {
  return fetch('/api/v1/skills', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      user_id,
      skill_id,
      value
    })
  });
}

export function addNewSkillApi(token, parent_id, name, desc) {
  return fetch('/api/v1/skills', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      name,
      parent_id,
      desc
    })
  });
}

export function deleteSkillApi(token, id) {
  return fetch('/api/v1/skills', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({
      id
    })
  });
}

export function loginApi(email, password) {
  return fetch('/api/v1/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
}

export function meApi(token) {
  return fetch('/api/v1/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  });
}
