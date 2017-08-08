exports.up = knex => {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('email', 100).notNullable().unique();
    table.string('first_name', 100).notNullable().comment('First Name');
    table.string('last_name', 100).notNullable().comment('Last Name');
    table.string('password', 100).notNullable();
    table.string('position').notNullable().comment('backend, pm, fed, etc.');
    table.string('roles').notNullable().comment('owner,pm,member or guest');
    table.decimal('rate', 6, 2).default(0).comment('Price Rate in $');
    table.boolean('locked').default(false).comment('if user banned');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.collate('utf8_general_ci');
  });
};

exports.down = knex => knex.schema.dropTableIfExists('users');
