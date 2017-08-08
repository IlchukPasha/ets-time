'use strict';
const Validator = require('./Validator');

module.exports = (req, res, next) => {
  const rules = {
    id: 'required|integer|min:0|exist_skill'
  };
  const validate = new Validator(req.body, rules);
  validate.passes(next);
  validate.fails(() => res.status(400).send(validate.errors));
};
