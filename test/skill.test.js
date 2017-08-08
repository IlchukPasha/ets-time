const assert = require('assert');
const app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');
const async = require('async');

const urls = {
  skills: '/api/v1/skills'
};

let token_owner = jwt.sign({ id: 1 }, env.secret);
let token_member = jwt.sign({ id: 3 }, env.secret);

const createCredentials = [
  [
    {
      name: 'Test skill'
    },
    400,
    'Parent id not exist'
  ],
  [
    {
      parent_id: 0,
      name: 'Test skill'
    },
    400,
    'Parent id must be min 1'
  ],
  [
    {
      parent_id: 100,
      name: 'Test skill'
    },
    400,
    'Parent id not found'
  ],
  [
    {
      parent_id: 1
    },
    400,
    'Name not exist'
  ],
  [
    {
      parent_id: 1,
      name: 'n'
    },
    400,
    'Name must be at least 2 characters'
  ],
  [
    {
      parent_id: 1,
      name: 'Test skill',
      desc: 'desc'
    },
    400,
    'Desc must be at least 5 characters'
  ]
];

const updateCredentials = [
  [
    {
      name: 'Update skill',
      parent_id: 1
    },
    400,
    'Id not exist'
  ],
  [
    {
      id: 'id',
      name: 'Update skill',
      parent_id: 1
    },
    400,
    'Id must be integer'
  ],
  [
    {
      id: -1,
      name: 'Update skill',
      parent_id: 1
    },
    400,
    'Id must be at least 0'
  ],
  [
    {
      id: 100,
      name: 'Update skill',
      parent_id: 1
    },
    400,
    'Skill not found'
  ],
  [
    {
      id: 4,
      parent_id: 1
    },
    400,
    'Name not exist'
  ],
  [
    {
      id: 4,
      name: 'n',
      parent_id: 1
    },
    400,
    'Name must be at least 2 characters'
  ],
  [
    {
      id: 4,
      name: 'Update skill',
      desc: 'desc',
      parent_id: 1
    },
    400,
    'Desc must be at least 5 characters'
  ],
  [
    {
      id: 4,
      name: 'Update skill'
    },
    400,
    'Parent id not exist'
  ],
  [
    {
      id: 4,
      name: 'Update skill',
      parent_id: -1
    },
    400,
    'Parent id must be at least 1'
  ],
  [
    {
      id: 4,
      name: 'Update skill',
      parent_id: 100
    },
    400,
    'Parent id not found'
  ]
];

const attachCredentials = [
  [
    {
      user_id: 5,
      value: 4
    },
    400,
    'Skill id not exist'
  ],
  [
    {
      skill_id: 'skill',
      user_id: 5,
      value: 4
    },
    400,
    'Skill id must be integer'
  ],
  [
    {
      skill_id: -1,
      user_id: 5,
      value: 4
    },
    400,
    'Skill id must be at least 1'
  ],
  [
    {
      skill_id: 100,
      user_id: 5,
      value: 4
    },
    400,
    'Skill id not found'
  ],
  [
    {
      skill_id: 2,
      value: 4
    },
    400,
    'User id not exist'
  ],
  [
    {
      skill_id: 2,
      user_id: 'user',
      value: 4
    },
    400,
    'User id must be integer'
  ],
  [
    {
      skill_id: 2,
      user_id: -1,
      value: 4
    },
    400,
    'User id must be at least 1'
  ],
  [
    {
      skill_id: 2,
      user_id: 100,
      value: 4
    },
    400,
    'User id not found'
  ],
  [
    {
      skill_id: 2,
      user_id: 5
    },
    400,
    'Value not exist'
  ],
  [
    {
      skill_id: 2,
      user_id: 5,
      value: 12
    },
    400,
    'Invalid value'
  ]
];

const deleteCredentialsPatched = [
  [null, 400, 'Id not exist'],
  ['id', 400, 'Id must be integer'],
  [-1, 400, 'Id must be at least 0'],
  [100, 400, 'Id not found']
];

describe('Skill controller', () => {
  before(done => {
    require('./TestCase')(knex, done);
  });

  it('list', done => {
    agent.get(urls.skills).set('authorization', token_owner).end((err, res) => {
      assert.notEqual(null, res.body);
      assert.equal(200, res.statusCode);
      done();
    });
  });

  it('list (without token)', done => {
    agent.get(urls.skills).expect(401, done);
  });

  it('list (as member)', done => {
    agent.get(urls.skills).set('authorization', token_member).expect(403, done);
  });

  it('list by id', done => {
    agent.get(urls.skills + '/3').set('authorization', token_owner).end((err, res) => {
      assert.notEqual(null, res.body);
      assert.equal(200, res.statusCode);
      done();
    });
  });

  it('list by id (without token)', done => {
    agent.get(urls.skills + '/3').expect(401, done);
  });

  it('list by id (as member)', done => {
    agent.get(urls.skills + '/3').set('authorization', token_member).expect(403, done);
  });

  it('list by id (not existing user)', done => {
    agent.get(urls.skills + '/100').set('authorization', token_owner).expect(404, done);
  });

  it('create', done => {
    agent
      .post(urls.skills)
      .set('authorization', token_owner)
      .send({
        name: 'Test skill',
        parent_id: 1
      })
      .expect(201, done);
  });

  it('create (without token)', done => {
    agent
      .post(urls.skills)
      .send({
        name: 'Test skill',
        parent_id: 1
      })
      .expect(401, done);
  });

  it('create (as member)', done => {
    agent
      .post(urls.skills)
      .set('authorization', token_member)
      .send({
        name: 'Test skill',
        parent_id: 1
      })
      .expect(403, done);
  });

  it('create errors', done => {
    async.each(
      createCredentials,
      (item, cb) => {
        agent.post(urls.skills).set('authorization', token_owner).send(item[0]).end((err, res) => {
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
      .patch(urls.skills)
      .set('authorization', token_owner)
      .send({
        id: 4,
        name: 'Update skill',
        parent_id: 1
      })
      .expect(200, done);
  });

  it('update (without token)', done => {
    agent
      .patch(urls.skills)
      .send({
        id: 4,
        name: 'Update skill',
        parent_id: 1
      })
      .expect(401, done);
  });

  it('update (as member)', done => {
    agent
      .patch(urls.skills)
      .set('authorization', token_member)
      .send({
        id: 4,
        name: 'Update skill',
        parent_id: 1
      })
      .expect(403, done);
  });

  it('update (not existing skill)', done => {
    agent
      .patch(urls.skills)
      .set('authorization', token_owner)
      .send({
        id: 4,
        name: 'Update skill',
        parent_id: 2
      })
      .expect(404, done);
  });

  it('update errors', done => {
    async.each(
      updateCredentials,
      (item, cb) => {
        agent.patch(urls.skills).set('authorization', token_owner).send(item[0]).end((err, res) => {
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

  it('attach', done => {
    agent
      .put(urls.skills)
      .set('authorization', token_owner)
      .send({
        skill_id: 3,
        user_id: 5,
        value: 5
      })
      .expect(201, done);
  });

  it('attach', done => {
    agent
      .put(urls.skills)
      .set('authorization', token_owner)
      .send({
        skill_id: 2,
        user_id: 5,
        value: 4
      })
      .expect(202, done);
  });

  it('attach (without token)', done => {
    agent
      .put(urls.skills)
      .send({
        skill_id: 2,
        user_id: 5,
        value: 4
      })
      .expect(401, done);
  });

  it('attach (as member)', done => {
    agent
      .put(urls.skills)
      .set('authorization', token_member)
      .send({
        skill_id: 2,
        user_id: 5,
        value: 4
      })
      .expect(403, done);
  });

  it('attach errors', done => {
    async.each(
      attachCredentials,
      (item, cb) => {
        agent.put(urls.skills).set('authorization', token_owner).send(item[0]).end((err, res) => {
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
      .delete(urls.skills)
      .set('authorization', token_owner)
      .send({
        id: 8
      })
      .expect(204, done);
  });

  it('delete (without token)', done => {
    agent
      .delete(urls.skills)
      .send({
        id: 8
      })
      .expect(401, done);
  });

  it('delete (as member)', done => {
    agent
      .delete(urls.skills)
      .set('authorization', token_member)
      .send({
        id: 8
      })
      .expect(403, done);
  });

  it('delete errors', done => {
    async.each(
      deleteCredentialsPatched,
      (item, cb) => {
        agent.delete(urls.skills).set('authorization', token_owner).send({ id: item[0] }).end((err, res) => {
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
