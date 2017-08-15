const assert = require('assert');
const app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');
const async = require('async');

const urls = {
  lines: '/api/v1/lines',
  lines_status: '/api/v1/lines/status'
};

let token_owner = jwt.sign({ id: 1 }, env.secret);
let token_member = jwt.sign({ id: 3 }, env.secret);

const listCredentials = [
  [
    {
      user: 'user',
      project: 'Very looooong titleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!!!!!!!!',
      date_start: '2017-07-24',
      date_end: '2017-07-26',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'Very long project name'
  ],
  [
    {
      user: 'user',
      project: 'ets',
      date_start: '2017-07-24',
      date_end: '2017-07-26',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'User must be integer'
  ],
  [
    {
      user: -1,
      project: 'ets',
      date_start: '2017-07-24',
      date_end: '2017-07-26',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'User must be at least 1'
  ],
  [
    {
      user: 1,
      project: 'e',
      date_start: '2017-07-24',
      date_end: '2017-07-26',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'Project must be at least 2 characters'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2017-07-50',
      date_end: '2017-07-26',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'Date start must be valid date format'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2017-07-29',
      date_end: '2017-08-31',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'Date end must be valid (0)'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2017-07-29',
      date_end: '2017-00-31',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'Date end must be valid (1)'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2016-01-29',
      date_end: '2016-02-29',
      status: 'Open',
      type_work: 'Development'
    },
    200,
    'Date end must be valid (2)'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2016-05-29',
      date_end: '2016-02-29',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'Date end must be after date to'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2017-07-29',
      date_end: '2017-02-31',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'Date end should be valid'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2017-07-24',
      date_end: '2017-41-26',
      status: 'Open',
      type_work: 'Development'
    },
    400,
    'Date end must be valid date format'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2017-07-24',
      date_end: '2017-07-26',
      status: 'Openn',
      type_work: 'Development'
    },
    400,
    'Invalid status'
  ],
  [
    {
      user: 1,
      project: 'ets',
      date_start: '2017-07-24',
      date_end: '2017-07-26',
      status: 'Open',
      type_work: 'Develop'
    },
    400,
    'Invalid type work'
  ]
];

const createCredentials = [
  [
    {
      task: 'test other controllers',
      type_work: 'Development',
      hours: '5.0',
      date_task: '2017-07-26'
    },
    400,
    'Project not exist'
  ],
  [
    {
      project: 'Very looooong titleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!!!!!!!!',
      task: 'test other controllers',
      type_work: 'Development',
      hours: '5.0',
      date_task: '2017-07-26'
    },
    400,
    'Very long project'
  ],
  [
    {
      project: 'NOrmal title of project',
      task: new Array(500).join('x'),
      type_work: 'Development',
      hours: '5.0',
      date_task: '2017-07-26'
    },
    400,
    'Very long project'
  ],
  [
    {
      project: 'e',
      task: 'test other controllers',
      type_work: 'Development',
      hours: '5.0',
      date_task: '2017-07-26'
    },
    400,
    'Project must be at least 2 characters'
  ],
  [
    {
      project: 'ets',
      type_work: 'Development',
      hours: '5.0',
      date_task: '2017-07-26'
    },
    400,
    'Task not exist'
  ],
  [
    {
      project: 'ets',
      task: 'te',
      type_work: 'Development',
      hours: '5.0',
      date_task: '2017-07-26'
    },
    400,
    'Task must be at least 3 characters'
  ],
  [
    {
      project: 'ets',
      task: 'test other controllers',
      hours: '5.0',
      date_task: '2017-07-26'
    },
    400,
    'Type work not exist'
  ],
  [
    {
      project: 'ets',
      task: 'test other controllers',
      type_work: 'Develop',
      hours: '5.0',
      date_task: '2017-07-26'
    },
    400,
    'Invalid type work'
  ],
  [
    {
      project: 'ets',
      task: 'test other controllers',
      type_work: 'Development',
      date_task: '2017-07-26'
    },
    400,
    'Hours not exist'
  ],
  [
    {
      project: 'ets',
      task: 'test other controllers',
      type_work: 'Development',
      hours: 'hours',
      date_task: '2017-07-26'
    },
    400,
    'Hours must be numeric'
  ],
  [
    {
      project: 'ets',
      task: 'test other controllers',
      type_work: 'Development',
      hours: -1,
      date_task: '2017-07-26'
    },
    400,
    'Hours must be at least 0'
  ],
  [
    {
      project: 'ets',
      task: 'test other controllers',
      type_work: 'Development',
      hours: 0
    },
    400,
    'Date task not exist'
  ],
  [
    {
      project: 'ets',
      task: 'test other controllers',
      type_work: 'Development',
      hours: 0,
      date_task: '2017-07-2628'
    },
    400,
    'Invalid date task'
  ]
];

const updateCredentials = [
  [
    {
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Id not exist'
  ],
  [
    {
      id: 'id',
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Id must be integer'
  ],
  [
    {
      id: -1,
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Id must be at least 0'
  ],
  [
    {
      id: 2,
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Project not exist'
  ],
  [
    {
      id: 2,
      project: 'e',
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Project must be at least 2'
  ],
  [
    {
      id: 2,
      project: 'ets',
      type_work: 'Development',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Task not exist'
  ],
  [
    {
      id: 2,
      project: 'ets',
      task: 'au',
      type_work: 'Development',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Task must be at least 3'
  ],
  [
    {
      id: 2,
      project: 'ets',
      task: 'authorization and registration forms',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Type work not exist'
  ],
  [
    {
      id: 2,
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Dev',
      hours: '4.5',
      date_task: '2017-07-26'
    },
    400,
    'Invalid type work'
  ],
  [
    {
      id: 2,
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Development',
      date_task: '2017-07-26'
    },
    400,
    'Hours not exist'
  ],
  [
    {
      id: 2,
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: 'abc',
      date_task: '2017-07-26'
    },
    400,
    'Hours must be numeric'
  ],
  [
    {
      id: 2,
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: '-1',
      date_task: '2017-07-26'
    },
    400,
    'Hours must be at least 0'
  ],
  [
    {
      id: 2,
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: '4.5'
    },
    400,
    'Date task not exist'
  ],
  [
    {
      id: 2,
      project: 'ets',
      task: 'authorization and registration forms',
      type_work: 'Development',
      hours: '4.5',
      date_task: '2017-077-26'
    },
    400,
    'Invalid date task'
  ]
];

const updateStatusCredentials = [
  [
    {
      status: 'Accepted'
    },
    400,
    'Id not exist'
  ],
  [
    {
      id: 'id',
      status: 'Accepted'
    },
    400,
    'Id must be integer'
  ],
  [
    {
      id: -1,
      status: 'Accepted'
    },
    400,
    'Id must be at least of 0'
  ],
  [
    {
      id: 2
    },
    400,
    'Status not exist'
  ],
  [
    {
      id: 2,
      status: 'Accep'
    },
    400,
    'Invalid status'
  ]
];

const deleteCredentials = [
  [{}, 400, 'Id not exist'],
  [
    {
      id: 'id'
    },
    400,
    'Id must be integer'
  ],
  [
    {
      id: -1
    },
    400,
    'Id must be at least 0'
  ]
];

describe('Line controller', () => {
  before(done => {
    require('./TestCase')(knex, done);
  });

  it('list', done => {
    agent.get(urls.lines).set('authorization', token_owner).end((err, res) => {
      assert.equal(200, res.statusCode);
      assert.notEqual(null, res.body.count);
      assert.notEqual(null, res.body.data);
      done();
    });
  });

  it('list (without token)', done => {
    agent.get(urls.lines).expect(401, done);
  });

  it('list errors', done => {
    async.each(
      listCredentials,
      (item, cb) => {
        agent.get(urls.lines).query(item[0]).set('authorization', token_owner).end((err, res) => {
          if (item[1] === res.statusCode) {
            cb();
          } else {
            cb(new Error(item[2]));
          }
        });
      },
      err => {
        done(err);
      }
    );
  });

  it('create', done => {
    agent
      .post(urls.lines)
      .set('authorization', token_member)
      .send({
        project: 'ets',
        task: 'write unit tests for user controller',
        type_work: 'Development',
        hours: '2.9',
        date_task: '2017-07-26'
      })
      .expect(201, done);
  });

  it('create (without token)', done => {
    agent
      .post(urls.lines)
      .send({
        project: 'ets',
        task: 'write unit tests for user controller',
        type_work: 'Development',
        hours: '2.9',
        date_task: '2017-07-26'
      })
      .expect(401, done);
  });

  it('create errors', done => {
    async.each(
      createCredentials,
      (item, cb) => {
        agent.post(urls.lines).set('authorization', token_owner).send(item[0]).end((err, res) => {
          if (item[1] === res.statusCode) {
            cb();
          } else {
            cb(new Error(item[2]));
          }
        });
      },
      err => {
        done(err);
      }
    );
  });

  it('update', done => {
    agent
      .patch(urls.lines)
      .set('authorization', token_owner)
      .send({
        id: '2',
        project: 'ets',
        task: 'authorization and registration forms',
        type_work: 'Development',
        hours: '4.5',
        date_task: '2017-07-26'
      })
      .expect(202, done);
  });

  it('update (as member not own)', done => {
    agent
      .patch(urls.lines)
      .set('authorization', token_member)
      .send({
        id: '2',
        project: 'ets',
        task: 'authorization and registration forms',
        type_work: 'Development',
        hours: '4.5',
        date_task: '2017-07-26'
      })
      .expect(404, done);
  });

  it('update (as member own)', done => {
    agent
      .patch(urls.lines)
      .set('authorization', token_member)
      .send({
        id: '4',
        project: 'ets',
        task: 'auth error with login',
        type_work: 'Bug fixing',
        hours: '5',
        date_task: '2017-07-27'
      })
      .expect(202, done);
  });

  it('update (without token)', done => {
    agent
      .patch(urls.lines)
      .send({
        id: '2',
        project: 'ets',
        task: 'authorization and registration forms',
        type_work: 'Development',
        hours: '4.5',
        date_task: '2017-07-26'
      })
      .expect(401, done);
  });

  it('update errors', done => {
    async.each(
      updateCredentials,
      (item, cb) => {
        agent.patch(urls.lines).set('authorization', token_owner).send(item[0]).end((err, res) => {
          if (item[1] === res.statusCode) {
            cb();
          } else {
            cb(new Error(item[2]));
          }
        });
      },
      err => {
        done(err);
      }
    );
  });

  it('update status', done => {
    agent
      .patch(urls.lines_status)
      .set('authorization', token_owner)
      .send({
        id: '1',
        status: 'Accepted'
      })
      .expect(200, done);
  });

  it('update status (without token)', done => {
    agent
      .patch(urls.lines_status)
      .send({
        id: '1',
        status: 'Accepted'
      })
      .expect(401, done);
  });

  it('update status (as member)', done => {
    agent
      .patch(urls.lines_status)
      .set('authorization', token_member)
      .send({
        id: '1',
        status: 'Accepted'
      })
      .expect(403, done);
  });

  it('update status (not existing)', done => {
    agent
      .patch(urls.lines_status)
      .set('authorization', token_owner)
      .send({
        id: 100,
        status: 'Accepted'
      })
      .expect(404, done);
  });

  it('update status errors', done => {
    async.each(
      updateStatusCredentials,
      (item, cb) => {
        agent.patch(urls.lines_status).set('authorization', token_owner).send(item[0]).end((err, res) => {
          if (item[1] === res.statusCode) {
            cb();
          } else {
            cb(new Error(item[2]));
          }
        });
      },
      err => {
        done(err);
      }
    );
  });

  it('delete', done => {
    agent
      .delete(urls.lines)
      .set('authorization', token_owner)
      .send({
        id: '5'
      })
      .expect(204, done);
  });

  it('delete (without token)', done => {
    agent
      .delete(urls.lines)
      .send({
        id: '5'
      })
      .expect(401, done);
  });

  it('delete (not own line)', done => {
    agent
      .delete(urls.lines)
      .set('authorization', token_owner)
      .send({
        id: 1
      })
      .expect(404, done);
  });

  it('delete (not existing line)', done => {
    agent
      .delete(urls.lines)
      .set('authorization', token_owner)
      .send({
        id: 100
      })
      .expect(404, done);
  });

  it('delete errors', done => {
    async.each(
      deleteCredentials,
      (item, cb) => {
        agent.delete(urls.lines).set('authorization', token_owner).send(item[0]).end((err, res) => {
          if (item[1] === res.statusCode) {
            cb();
          } else {
            cb(new Error(item[2]));
          }
        });
      },
      err => {
        done(err);
      }
    );
  });
});
