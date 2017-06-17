import moment from 'moment';

// Handle http errors
export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

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
  let { workType, status, project, task, startDate, endDate } = filters;
  const sWeek = getStartOfWeek().format('YYYY-MM-DD');
  const eWeek = getEndOfWeek().format('YYYY-MM-DD');

  return (
    workType !== '' ||
    status !== '' ||
    project !== '' ||
    task !== '' ||
    startDate.format('YYYY-MM-DD') !== sWeek ||
    endDate.format('YYYY-MM-DD') !== eWeek
  );
}

// Get initial filters
export function getInitFilters() {
  const startWeek = getStartOfWeek();
  const endWeek = getEndOfWeek();

  return {
    workType: '',
    status: '',
    project: '',
    task: '',
    startDate: startWeek,
    endDate: endWeek
  };
}
