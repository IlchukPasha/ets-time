exports.up = knex => {
  return knex.table('skills').insert([
    {
      name: 'PHP'
    },
    {
      name: 'iOS'
    },
    {
      name: 'FeD'
    },
    {
      parent_id: 1,
      name: 'Composer'
    },
    {
      parent_id: 1,
      name: 'Symfony'
    },
    {
      parent_id: 1,
      name: 'Laravel'
    },
    {
      parent_id: 1,
      name: 'Wordpress'
    },
    {
      parent_id: 1,
      name: 'Code Igniter'
    }
  ]);
};

exports.down = knex => {
  return knex.table('skills').truncate();
};
