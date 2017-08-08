exports.up = (knex, Promise) => {
  if (process.env.NODE_ENV === 'testing') {
    return knex.table('skill_gradation').insert([
      {
        id: 1,
        user_id: 3,
        skill_id: 6
      },
      {
        id: 2,
        user_id: 3,
        skill_id: 8
      },
      {
        id: 3,
        user_id: 5,
        skill_id: 2
      }
    ]);
  }
};

exports.down = (knex, Promise) => {
  return knex('skill_gradation').del();
};
