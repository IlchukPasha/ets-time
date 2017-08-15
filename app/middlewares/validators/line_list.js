'use strict';
const Validator = require('./Validator');
const env = require('./../../config');
const hasRole = require('./../../libs/hasRole');

module.exports = (req, res, next) => {
  const rules = {
    user: 'integer|min:1',
    project: 'string|min:2|max:60',
    date_start: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/|my_date',
    date_end: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/|my_date',
    status: 'string|in:' + env.task_status.join(','),
    type_work: 'string|in:' + env.type_works.join(',')
  };

  const validate = new Validator(req.query, rules);
  if (validate.fails()) {
    res.status(400).send(validate.errors);
  } else {
    req._full_list = hasRole(req._user.roles, ['owner', 'pm']);
    next();
  }
};
