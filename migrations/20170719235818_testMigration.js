exports.up = function(knex, Promise) {
  return knex.schema.table('knex_migrations', t => {
    t.timestamp('migration_time').comment('Check if knex works fine!').alter();
  });
};

exports.down = knex => {
  return knex.schema.table('knex_migrations', t => {
    t.timestamp('migration_time').alter();
  });
};
