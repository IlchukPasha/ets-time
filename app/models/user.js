'use strict';
const knex = require('./../libs/knex');
const { omit } = require('lodash');

module.exports = {
  getById: (user_id, cb) => {
    knex('users')
      .where('id', user_id)
      .first()
      .then(user => {
        if (user) {
          let _user = omit(user, ['password']);
          _user.roles = _user.roles.split(',');
          _user.position = _user.position.split(',');
          cb(null, _user);
        } else {
          cb(true);
        }
      })
      .catch(cb);
  }
};
