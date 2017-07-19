exports.up = function(knex, Promise) {
  return knex.schema.table('knex_migrations', t => {
    t.string('migration_time').comment('Check if knex works fine!').alter();
  });
};

exports.down = function(knex, Promise) {};
