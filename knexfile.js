const env = require('./app/config').db;
module.exports = {
  development: env,
  production: env,
  testing: env
};
