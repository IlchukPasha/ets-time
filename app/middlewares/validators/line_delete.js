'use strict';
const Validator = require('./Validator');
const knex = require('./../../libs/knex');

module.exports = (req, res, next) => {
  const rules = {
    id: 'required|integer|min:0'
  };
  const validate = new Validator(req.body, rules);
  if (validate.fails()) {
    res.status(400).send(validate.errors);
  } else {
    knex('track_lines')
      .where({ id: req.body.id, user_id: req._user.id })
      .first()
      .count('* as c')
      .then(count => {
        if (count.c) {
          next();
        } else {
          res.status(404).send();
        }
      })
      .catch(next);
  }
};
