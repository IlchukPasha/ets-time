import moment from 'moment';

// Parse http response to json
export function parseJSON(response) {
  return response.json();
}

// Format date to server special
export function formatDateToServer(inputDate) {
  return moment(inputDate).format('YYYY-MM-DD');
}

// Get start of week
export function getStartOfWeek(date) {
  return moment().startOf('isoWeek');
}

// Get end of week
export function getEndOfWeek(date) {
  return moment().endOf('isoWeek');
}

// Check if filters was selected
export function showClearFilters(filters) {
  let { type_work, status, project, task, startDate, endDate, user } = filters;
  const sWeek = getStartOfWeek().format('YYYY-MM-DD');
  const eWeek = getEndOfWeek().format('YYYY-MM-DD');

  return (
    type_work !== '' ||
    status !== '' ||
    user !== '' ||
    project !== '' ||
    task !== '' ||
    startDate.format('YYYY-MM-DD') !== sWeek ||
    endDate.format('YYYY-MM-DD') !== eWeek
  );
}

// Get initial filters
export function getInitFilters() {
  let dates = [];
  for (let i = 0; i < 12; i++) {
    let label_human = moment().subtract(i, 'month').format('YYYY MMM');
    let raw_label = moment().subtract(i, 'month').format('YYYY-MM-01');
    dates.push({ value: i, raw_label: raw_label, label: label_human });
  }
  return {
    user: 0,
    date: moment().format('YYYY-MM-01'),
    state_selected_date: 0,
    state_selected_user: null,
    dates
  };
}

export function getInitFiltersForTrack() {
  const startWeek = getStartOfWeek();
  const endWeek = getEndOfWeek();

  return {
    type_work: '',
    status: '',
    project: '',
    task: '',
    startDate: startWeek,
    endDate: endWeek,
    user: ''
  };
}

export function getInitNewTrackData() {
  return {
    project: '',
    task: '',
    type_work: '',
    hours: '',
    trackDate: moment(),
    isLoading: false
  };
}

export function getInitNewUserData() {
  return {
    first_name: '',
    last_name: '',
    email: '',
    roles: [],
    position: [],
    rate: 0,
    password: '',
    isLoading: false
  };
}

export function getTop(data, field, field1, field2) {
  let grouped = [];
  let top;

  data.forEach(t => {
    let founded = grouped.find(i => i[field] === t[field]);
    if (!founded) {
      let obj = {
        [field]: t[field],
        hours: t.hours
      };

      if (field1) obj[field1] = t[field1];
      if (field2) obj[field2] = t[field2];
      grouped.push(obj);
    } else {
      founded.hours += +t.hours;
    }
  });

  top = grouped[0];
  grouped.forEach(t => {
    if (t.hours > top.hours) top = t;
  });

  return top;
}

export function getFirstLetter(string) {
  return string ? string.substring(0, 1) : string;
}
