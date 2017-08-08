'use strict';
const { intersection } = require('lodash');

module.exports = (user_roles, needRoles) => intersection(user_roles, needRoles).length > 0;
