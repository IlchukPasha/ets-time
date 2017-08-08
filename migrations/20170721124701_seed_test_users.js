const bcrypt = require('bcrypt-nodejs');
const password = bcrypt.hashSync('password', bcrypt.genSaltSync(10));

exports.up = knex => {
  if (process.env.NODE_ENV === 'testing') {
    return knex.table('users').insert([
      {
        email: 'owner-pm@tmail.com',
        first_name: 'Wilson',
        last_name: 'Martinez',
        password: password,
        position: 'other',
        roles: 'owner,pm'
      },
      {
        email: 'member-pm@tmail.com',
        first_name: 'Harris',
        last_name: 'Clark',
        password: password,
        position: 'other',
        roles: 'member,pm'
      },
      {
        email: 'owner-member@tmail.com',
        first_name: 'Scott',
        last_name: 'Allen',
        password: password,
        position: 'other',
        roles: 'owner,member'
      },
      {
        email: 'locked@tmail.com',
        first_name: 'Kevin',
        last_name: 'Johnson',
        password: password,
        position: 'php',
        locked: 1,
        roles: 'member'
      }
    ]);
  }
};

exports.down = knex => {
  return knex('users').where('email', 'like', '%tmail%').del();
};
