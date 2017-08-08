exports.up = knex => {
  return knex.schema.createTable('skill_gradation', table => {
    table.increments();
    table.integer('user_id').unsigned().index();
    table.integer('skill_id').unsigned().index();
    table.integer('value').default(0).comment('Number of point in this skill');
    table.unique(['user_id', 'skill_id']);
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('skill_id').references('skills.id').onDelete('CASCADE');
    table.collate('utf8_general_ci');
  });
};

exports.down = knex => knex.schema.dropTableIfExists('skill_gradation');
