'use strict';
const Validator = require('./Validator');
const env = require('./../../config');
const bcrypt = require('bcrypt-nodejs');
const { pick } = require('lodash');
const salt = bcrypt.genSaltSync();

module.exports = (req, res, next) => {
  const rules = {
    first_name: 'required|min:2',
    last_name: 'required|min:2',
    email: 'required|email|unique',
    position: 'required|array|in:' + env.positions.join(','),
    roles: 'required|array|in:' + env.roles.join(','),
    rate: 'required|numeric|min:0',
    password: 'required|alpha_num|min:5'
  };
  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    let vars = pick(req.body, ['first_name', 'last_name', 'email', 'rate']);
    vars.roles = req.body.roles.join(',');
    vars.position = req.body.position.join(',');
    vars.password = bcrypt.hashSync(req.body.password, salt);
    req._vars = vars;
    next();
  });
  validate.fails(() => res.status(400).send(validate.errors));
};
