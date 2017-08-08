const moment = require('moment');

const getDatesInMounth = check_date => {
  let result = [];
  let date = new Date(check_date);
  let daysInMonth = moment(check_date).daysInMonth();

  while (daysInMonth !== result.length) {
    result.push(moment(date).format('YYYY-MM-DD'));
    date.setDate(date.getDate() + 1);
  }
  return result;
};

module.exports = {
  getDatesInMounth: getDatesInMounth
};
