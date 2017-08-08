exports.up = knex => {
  return knex.schema.createTable('track_lines', table => {
    table.increments();
    table.integer('user_id').unsigned().index();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.string('project').notNullable().comment('Project name');
    table.string('task').notNullable().comment('Description of task');
    table.string('type_work', 50).notNullable().comment('Type of Work');
    table.enum('status', ['Accepted', 'Declined', 'Open']).notNullable().default('Open').comment('Status task');
    table.decimal('hours', 6, 2).default(0).comment('Spent hours');
    table.decimal('estimated_time', 6, 2).default(0).comment('Estimated hours');
    table.decimal('approved_time', 6, 2).default(0).comment('	Approved time by admin or pm');
    table.decimal('rate', 6, 2).default(0).comment('Price Rate in $');
    table.date('date_task');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.collate('utf8_general_ci');
  });
};

exports.down = knex => knex.schema.dropTableIfExists('track_lines');
