exports.up = knex => {
  return knex.schema.createTable('skills', table => {
    table.increments();
    table.integer('parent_id', 10).index().nullable().unsigned().default(null);
    table.string('name', 100).notNullable();
    table.string('desc', 100);
    table.collate('utf8_general_ci');
    table.unique(['name', 'parent_id']);
    table.foreign('parent_id').references('skills.id').onDelete('CASCADE');
  });
};

exports.down = knex => knex.schema.dropTableIfExists('skills');
