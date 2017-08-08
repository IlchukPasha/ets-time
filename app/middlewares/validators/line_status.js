'use strict';
const Validator = require('./Validator');
const env = require('./../../config');
const knex = require('./../../libs/knex');

module.exports = (req, res, next) => {
  const rules = {
    id: 'required|integer|min:0',
    status: 'required|in:' + env.task_status.join(',')
  };

  const validate = new Validator(req.body, rules);
  if (validate.fails()) {
    res.status(400).send(validate.errors);
  } else {
    knex('track_lines')
      .where({ id: req.body.id })
      .count('* as c')
      .first()
      .then(data => {
        if (data.c) {
          next();
        } else {
          res.status(404).send();
        }
      })
      .catch(next);
  }
};
