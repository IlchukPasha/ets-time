'use strict';
const { findIndex } = require('lodash');

module.exports = roles => (req, res, next) => {
  if (findIndex(roles, item => req._user.roles.includes(item)) >= 0) {
    next();
  } else {
    res.status(403).end();
  }
};
