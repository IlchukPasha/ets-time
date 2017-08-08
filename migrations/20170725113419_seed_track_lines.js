exports.up = (knex, Promise) => {
  if (process.env.NODE_ENV === 'testing') {
    return knex.table('track_lines').insert([
      {
        id: 1,
        user_id: 3,
        project: 'ets',
        task: 'authorization',
        type_work: 'Development',
        status: 'Open',
        hours: '3.5',
        estimated_time: '0',
        approved_time: '0',
        rate: '0',
        date_task: '2017-07-25',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 5,
        project: 'ets',
        task: 'authorization form',
        type_work: 'Development',
        status: 'Open',
        hours: '2.3',
        estimated_time: '0',
        approved_time: '0',
        rate: '0',
        date_task: '2017-07-25',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        user_id: 4,
        project: 'ets',
        task: 'test authorization',
        type_work: 'Testing',
        status: 'Accepted',
        hours: '1',
        estimated_time: '0',
        approved_time: '0',
        rate: '0',
        date_task: '2017-07-26',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        user_id: 3,
        project: 'ets',
        task: 'auth error with login',
        type_work: 'Bug fixing',
        status: 'Declined',
        hours: '0.8',
        estimated_time: '0',
        approved_time: '0',
        rate: '0',
        date_task: '2017-07-26',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        user_id: 1,
        project: 'ets',
        task: 'crud operations',
        type_work: 'Development',
        status: 'Open',
        hours: '1',
        estimated_time: '0',
        approved_time: '0',
        rate: '0',
        date_task: '2017-07-26',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  }
};

exports.down = (knex, Promise) => {
  return knex('track_lines').del();
};
